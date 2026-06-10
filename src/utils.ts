import { AmortizationRow } from './types';

/**
 * Calculates monthly EMI based on standard ordinary annuity formula.
 */
export function calculateEMI(principal: number, ratePerAnnum: number, tenureMonths: number, plan: 'advance' | 'arrears' = 'arrears'): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (ratePerAnnum <= 0) return principal / tenureMonths;

  const r = ratePerAnnum / 12 / 100;
  const n = tenureMonths;

  const emiArrears = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  if (plan === 'advance') {
    // Annuity Due: payment is made at beginning of period, reducing interest duration by 1 period.
    return emiArrears / (1 + r);
  }

  return emiArrears;
}

/**
 * Generates month-by-month, year-by-year, and FY-by-FY amortization schedules
 */
export function generateSchedules(
  principal: number,
  ratePerAnnum: number,
  tenureMonths: number,
  plan: 'advance' | 'arrears' = 'arrears'
) {
  const monthly: AmortizationRow[] = [];
  const r = ratePerAnnum / 12 / 100;
  
  let balance = principal;
  const emi = calculateEMI(principal, ratePerAnnum, tenureMonths, plan);

  if (emi <= 0) return { monthly: [], yearly: [], financialYear: [] };

  // Generate monthly values
  for (let m = 1; m <= tenureMonths; m++) {
    let interest = balance * r;
    if (ratePerAnnum <= 0) interest = 0;
    
    let principalPaid = emi - interest;

    if (principalPaid > balance || m === tenureMonths) {
      principalPaid = balance;
      interest = Math.max(0, emi - principalPaid);
      balance = 0;
    } else {
      balance -= principalPaid;
    }

    const percentage = principal > 0 ? (balance / principal) * 100 : 0;

    monthly.push({
      period: m,
      label: `Month ${m}`,
      emi: emi,
      principalPaid: principalPaid,
      interestPaid: interest,
      endingBalance: balance,
      endingBalancePercentage: percentage,
    });

    if (balance <= 0) break;
  }

  // Generate Year-by-Year aggregates (12 month lumps)
  const yearly: AmortizationRow[] = [];
  let accumPrincipal = 0;
  let accumInterest = 0;
  let yr = 1;

  for (let i = 0; i < monthly.length; i++) {
    accumPrincipal += monthly[i].principalPaid;
    accumInterest += monthly[i].interestPaid;

    if ((i + 1) % 12 === 0 || i === monthly.length - 1) {
      const lastBalance = monthly[i].endingBalance;
      const percentage = principal > 0 ? (lastBalance / principal) * 100 : 0;
      
      yearly.push({
        period: yr,
        label: `Year ${yr}`,
        emi: accumPrincipal + accumInterest,
        principalPaid: accumPrincipal,
        interestPaid: accumInterest,
        endingBalance: lastBalance,
        endingBalancePercentage: percentage,
      });

      accumPrincipal = 0;
      accumInterest = 0;
      yr++;
    }
  }

  // Generate Financial Year aggregates (starting from current year, e.g., 2026)
  // Let's assume loan starts in June 2026.
  // FY 2026-27 is months June 2026 - Mar 2027 (10 months).
  // Subsequent FYs are 12 months each (Apr - Mar).
  const financialYear: AmortizationRow[] = [];
  let currentMonthIndex = 5; // June is 0-indexed month 5
  let currentYear = 2026;
  
  let fyPrincipal = 0;
  let fyInterest = 0;
  let fyPeriodIndex = 1;

  for (let i = 0; i < monthly.length; i++) {
    fyPrincipal += monthly[i].principalPaid;
    fyInterest += monthly[i].interestPaid;

    // Check if we hit March (month index 2) or end of sequence
    if (currentMonthIndex === 2 || i === monthly.length - 1) {
      const lastBalance = monthly[i].endingBalance;
      const percentage = principal > 0 ? (lastBalance / principal) * 100 : 0;
      
      // Calculate FY label, e.g., "FY 2026-27"
      const nextYearAbbr = (currentYear + 1).toString().slice(-2);
      const label = `FY ${currentYear}-${nextYearAbbr}`;

      financialYear.push({
        period: fyPeriodIndex,
        label: label,
        emi: fyPrincipal + fyInterest,
        principalPaid: fyPrincipal,
        interestPaid: fyInterest,
        endingBalance: lastBalance,
        endingBalancePercentage: percentage,
      });

      fyPrincipal = 0;
      fyInterest = 0;
      fyPeriodIndex++;
      currentYear++;
    }

    // Increment month index, wrap at 12
    currentMonthIndex = (currentMonthIndex + 1) % 12;
  }

  return { monthly, yearly, financialYear };
}

/**
 * Advanced Simulator supporting prepayments
 */
export function simulateAdvancedPrepayments(options: {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  monthlyPrepayment: number;
  monthlyPrepaymentStart: number;
  yearlyPrepayment: number;
  yearlyPrepaymentStart: number;
  oneTimePrepayment: number;
  oneTimePrepaymentMonth: number;
}) {
  const {
    loanAmount,
    interestRate,
    tenureYears,
    monthlyPrepayment,
    monthlyPrepaymentStart,
    yearlyPrepayment,
    yearlyPrepaymentStart,
    oneTimePrepayment,
    oneTimePrepaymentMonth,
  } = options;

  const totalOriginalMonths = tenureYears * 12;
  const r = interestRate / 12 / 100;
  const originalEmi = calculateEMI(loanAmount, interestRate, totalOriginalMonths, 'arrears');

  if (originalEmi <= 0) {
    return {
      monthly: [],
      originalTotalInterest: 0,
      prepaymentTotalInterest: 0,
      savings: 0,
      earlyMonths: 0,
      closingMonth: 0,
    };
  }

  // Calculate baseline first
  let tempBal = loanAmount;
  let originalTotalInterest = 0;
  for (let m = 1; m <= totalOriginalMonths; m++) {
    const interest = tempBal * r;
    const principalPaid = originalEmi - interest;
    originalTotalInterest += interest;
    tempBal = Math.max(0, tempBal - principalPaid);
    if (tempBal <= 0) break;
  }

  // Simulate with Prepayments
  const prepayMonthly: AmortizationRow[] = [];
  let balance = loanAmount;
  let prepaymentTotalInterest = 0;
  let closedMonth = totalOriginalMonths;

  for (let m = 1; m <= totalOriginalMonths; m++) {
    const interest = balance * r;
    let basePrincipalPaid = originalEmi - interest;
    if (basePrincipalPaid > balance) {
      basePrincipalPaid = balance;
    }

    let extraPrepay = 0;

    // Apply monthly prepayments
    if (m >= monthlyPrepaymentStart && monthlyPrepayment > 0) {
      extraPrepay += monthlyPrepayment;
    }

    // Apply yearly prepayments (applied annually on the starting month and multiples)
    const yearNumber = Math.ceil(m / 12);
    if (yearNumber >= yearlyPrepaymentStart && (m - 1) % 12 === 0 && yearlyPrepayment > 0) {
      extraPrepay += yearlyPrepayment;
    }

    // Apply one-time prepayment
    if (m === oneTimePrepaymentMonth && oneTimePrepayment > 0) {
      extraPrepay += oneTimePrepayment;
    }

    let totalPrincipalPaid = basePrincipalPaid + extraPrepay;
    
    if (totalPrincipalPaid >= balance) {
      totalPrincipalPaid = balance;
      prepaymentTotalInterest += interest;
      balance = 0;
      closedMonth = m;
      
      prepayMonthly.push({
        period: m,
        label: `Month ${m}`,
        emi: totalPrincipalPaid + interest,
        principalPaid: totalPrincipalPaid,
        interestPaid: interest,
        endingBalance: 0,
        endingBalancePercentage: 0,
      });
      break;
    } else {
      balance -= totalPrincipalPaid;
      prepaymentTotalInterest += interest;

      prepayMonthly.push({
        period: m,
        label: `Month ${m}`,
        emi: totalPrincipalPaid + interest,
        principalPaid: totalPrincipalPaid,
        interestPaid: interest,
        endingBalance: balance,
        endingBalancePercentage: (balance / loanAmount) * 100,
      });
    }
  }

  const earlyMonths = totalOriginalMonths - closedMonth;
  const savings = Math.max(0, originalTotalInterest - prepaymentTotalInterest);

  return {
    monthly: prepayMonthly,
    originalTotalInterest,
    prepaymentTotalInterest,
    savings,
    earlyMonths,
    closingMonth: closedMonth,
  };
}
