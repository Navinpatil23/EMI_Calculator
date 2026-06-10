import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  Percent, 
  Car, 
  Home, 
  User as UserIcon, 
  HelpCircle, 
  FileDown, 
  Share2, 
  FileSpreadsheet, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronsUpDown, 
  AlertCircle, 
  TrendingDown, 
  Info,
  ArrowRight,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { 
  calculateEMI, 
  generateSchedules, 
  simulateAdvancedPrepayments,
  simulateSIP,
  simulateLumpsum,
  simulateFD,
  simulateRD 
} from './utils';
import { Language, LoanType, TenureType, AppTab, InvestmentType, translations } from './types';
import Navbar from './components/Navbar';
import BankRateTable from './components/BankRateTable';
import AmortizationTable from './components/AmortizationTable';
import FloatingRateSection from './components/FloatingRateSection';
import LoanCharts from './components/LoanCharts';
import LegalModals from './components/LegalModals';
import { articles } from './data/articles';

// Toast structure
interface Toast {
  id: string;
  msg: string;
  type: 'success' | 'error';
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 200; // ms
    const stepTime = 15;
    const totalSteps = duration / stepTime;
    const diff = end - start;
    const stepVal = diff / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(start + (stepVal * currentStep)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>₹{Math.round(displayValue).toLocaleString('en-IN')}</span>;
}

export default function App() {
  // General Theme and Language parameters
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('emi_calc_lang');
    return (saved as Language) || 'en';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('emi_calc_dark');
    if (saved) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('calculator');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Legal Trust & AdSense Modal states
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  const openLegalModal = (type: 'privacy' | 'terms' | 'contact') => {
    setLegalModalType(type);
    setIsLegalModalOpen(true);
  };

  // URL-based article routing
  const [activeArticleId, setActiveArticleId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('article');
  });

  // ----------------------------------------------------
  // STANDARD CALCULATOR STATES
  // ----------------------------------------------------
  const [loanType, setLoanType] = useState<LoanType>('home');
  const [amount, setAmount] = useState<number>(2500000); // 25 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenure, setTenure] = useState<number>(20); // 20 years
  const [tenureType, setTenureType] = useState<TenureType>('years');
  const [carEMIPlan, setCarEMIPlan] = useState<'advance' | 'arrears'>('arrears');

  // For slider ticks helper bounds by active LoanType
  const amountConfig = {
    home: { min: 500000, max: 20000000, step: 50000, ticks: [500000, 5000000, 10000000, 15000000, 20000000], labelsEn: ['5L', '50L', '1Cr', '1.5Cr', '2Cr'], labelsHi: ['5लाख', '50लाख', '1करोड़', '1.5करोड़', '2करोड़'] },
    car: { min: 100000, max: 5000000, step: 25000, ticks: [100000, 1000000, 2000000, 3000000, 4000000, 5000000], labelsEn: ['1L', '10L', '20L', '30L', '40L', '50L'], labelsHi: ['1लाख', '10लाख', '20लाख', '30लाख', '40लाख', '50लाख'] },
    personal: { min: 50000, max: 4000000, step: 10000, ticks: [50000, 1000000, 2000000, 3000000, 4000000], labelsEn: ['50K', '10L', '20L', '30L', '40L'], labelsHi: ['50K', '10लाख', '20लाख', '30लाख', '40लाख'] }
  };

  const currentAmtBounds = amountConfig[loanType];

  // ----------------------------------------------------
  // COMPARE SCENARIOS STATES
  // ----------------------------------------------------
  const [compAmtA, setCompAmtA] = useState<number>(3000000);
  const [compRateA, setCompRateA] = useState<number>(8.5);
  const [compTenureA, setCompTenureA] = useState<number>(20);

  const [compAmtB, setCompAmtB] = useState<number>(3000000);
  const [compRateB, setCompRateB] = useState<number>(8.25);
  const [compTenureB, setCompTenureB] = useState<number>(15);

  // ----------------------------------------------------
  // ADVANCED HOME LOAN STATES
  // ----------------------------------------------------
  const [advHomeValue, setAdvHomeValue] = useState<number>(4000000); // 40 Lakhs home
  const [advDownPaymentPercent, setAdvDownPaymentPercent] = useState<number>(20); // 20% down payment
  const [advLoanInsurance, setAdvLoanInsurance] = useState<number>(45000); // HLPP premium flat rate
  const [advProcessingFeePercent, setAdvProcessingFeePercent] = useState<number>(0.5); // 0.5% fee
  const [advPropertyTax, setAdvPropertyTax] = useState<number>(12000); // ₹12k yearly tax
  const [advHomeInsurance, setAdvHomeInsurance] = useState<number>(3500); // ₹3.5k home ins
  const [advMaintenance, setAdvMaintenance] = useState<number>(2500); // ₹2500 monthly maint
  const [advRate, setAdvRate] = useState<number>(8.5);
  const [advTenureY, setAdvTenureY] = useState<number>(20);

  // Prepayments
  const [prepayMonthly, setPrepayMonthly] = useState<number>(5000);
  const [prepayMonthlyStart, setPrepayMonthlyStart] = useState<number>(12); // starts from month 12
  const [prepayYearly, setPrepayYearly] = useState<number>(50000);
  const [prepayYearlyStart, setPrepayYearlyStart] = useState<number>(2); // year 2 starts
  const [prepayOneTime, setPrepayOneTime] = useState<number>(100000);
  const [prepayOneTimeMonth, setPrepayOneTimeMonth] = useState<number>(36); // month 36 (3rd year end)
  const [isPrepayCollapsibleOpen, setIsPrepayCollapsibleOpen] = useState<boolean>(true);

  // Computed Down Payment dynamic conversions
  const computedDownPaymentVal = (advHomeValue * advDownPaymentPercent) / 100;
  const computedLoanAmount = Math.max(0, advHomeValue - computedDownPaymentVal + advLoanInsurance);
  const computedProcessingFeeVal = (computedLoanAmount * advProcessingFeePercent) / 100;

  // ----------------------------------------------------
  // CREDIT CARD STATES
  // ----------------------------------------------------
  const [ccPurchaseAmt, setCcPurchaseAmt] = useState<number>(50000);
  const [ccRate, setCcRate] = useState<number>(14.5); // CC Rate per annum
  const [ccTenureMonths, setCcTenureMonths] = useState<number>(12); // 12 months pill
  const [ccProcessingFee, setCcProcessingFee] = useState<number>(199); // absolute or % (flat in INR)
  const [ccApplyGst, setCcApplyGst] = useState<boolean>(true); // GST 18% on fees

  // ----------------------------------------------------
  // INVESTMENT CALCULATOR STATES
  // ----------------------------------------------------
  const [investmentType, setInvestmentType] = useState<InvestmentType>('sip');
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipTenure, setSipTenure] = useState<number>(10);
  
  const [lumpAmount, setLumpAmount] = useState<number>(100000);
  const [lumpRate, setLumpRate] = useState<number>(12);
  const [lumpTenure, setLumpTenure] = useState<number>(10);

  const [fdAmount, setFdAmount] = useState<number>(100000);
  const [fdRate, setFdRate] = useState<number>(7);
  const [fdTenure, setFdTenure] = useState<number>(5);

  const [rdAmount, setRdAmount] = useState<number>(5000);
  const [rdRate, setRdRate] = useState<number>(7);
  const [rdTenure, setRdTenure] = useState<number>(5);

  // ----------------------------------------------------
  // TOAST TRIGGER
  // ----------------------------------------------------
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, msg, type }].slice(-3));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2505);
  };

  // ----------------------------------------------------
  // INITIALIZE PARAMS FROM URL STATE
  // ----------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pType = params.get('type') as LoanType;
    const pAmount = params.get('amount');
    const pRate = params.get('rate');
    const pTenure = params.get('tenure');
    const pTenureType = params.get('tenureType') as TenureType;

    if (pType) setLoanType(pType);
    if (pAmount) {
      const parsedAmt = parseInt(pAmount, 10);
      if (!isNaN(parsedAmt)) setAmount(parsedAmt);
    }
    if (pRate) {
      const parsedRate = parseFloat(pRate);
      if (!isNaN(parsedRate)) setInterestRate(parsedRate);
    }
    if (pTenure) {
      const parsedTen = parseInt(pTenure, 10);
      if (!isNaN(parsedTen)) setTenure(parsedTen);
    }
    if (pTenureType) setTenureType(pTenureType);
  }, []);

  // Update URL state upon parameters change (Calculator + Article router states)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeArticleId) {
      url.searchParams.set('article', activeArticleId);
    } else {
      url.searchParams.delete('article');
      url.searchParams.set('type', loanType);
      url.searchParams.set('amount', amount.toString());
      url.searchParams.set('rate', interestRate.toString());
      url.searchParams.set('tenure', tenure.toString());
      url.searchParams.set('tenureType', tenureType);
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeArticleId, loanType, amount, interestRate, tenure, tenureType]);

  // Handle HTML document body theme class toggling
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('emi_calc_dark', darkMode.toString());
  }, [darkMode]);

  // Handle switching language preference
  const handleLangChange = (language: Language) => {
    setLang(language);
    localStorage.setItem('emi_calc_lang', language);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // ----------------------------------------------------
  // COMPUTED NUMBERS FOR BASIC CALCULATOR
  // ----------------------------------------------------
  const actualMonths = tenureType === 'years' ? tenure * 12 : tenure;
  const standardEmiValue = calculateEMI(amount, interestRate, actualMonths, loanType === 'car' ? carEMIPlan : 'arrears');
  const totalPayment = standardEmiValue * actualMonths;
  const totalInterest = Math.max(0, totalPayment - amount);

  const schedules = generateSchedules(amount, interestRate, actualMonths, loanType === 'car' ? carEMIPlan : 'arrears');

  // Multiplier safety checks
  const handleApplyBankRate = (appliedRate: number, bankName: string) => {
    setInterestRate(appliedRate);
    showToast(
      lang === 'en' 
        ? `${translations.en.toastPrepopulate} (${bankName}: ${appliedRate}%)` 
        : `${translations.hi.toastPrepopulate} (${bankName}: ${appliedRate}%)`,
      'success'
    );
  };

  // Short dynamic labels formatter
  const formatShortValue = (value: number) => {
    if (value >= 10000000) {
      const cr = value / 10000000;
      return lang === 'en' ? `₹${cr.toFixed(2)} ${translations.en.crore}` : `₹${cr.toFixed(2)} ${translations.hi.crore}`;
    } else if (value >= 100000) {
      const lk = value / 100000;
      return lang === 'en' ? `₹${lk.toFixed(1)} ${translations.en.lakhs}` : `₹${lk.toFixed(1)} ${translations.hi.lakhs}`;
    } else {
      return `₹${Math.round(value).toLocaleString('en-IN')}`;
    }
  };

  // Handle synced conversions between standard tenure inputs (years <-> months)
  const handleTenureToggle = (type: TenureType) => {
    if (type === tenureType) return;
    if (type === 'months') {
      setTenure(Math.min(360, tenure * 12));
    } else {
      setTenure(Math.max(1, Math.round(tenure / 12)));
    }
    setTenureType(type);
  };

  const handleAmountChange = (val: number) => {
    setAmount(val);
  };

  const handleAmountSlider = (val: number) => {
    setAmount(val);
  };

  // Export handlers for PDF, Excel, and Share Links
  const handleExportPDFClick = () => {
    try {
      const { jsPDF } = (window as any).jspdf || {};
      if (!jsPDF) {
        showToast('PDF library not loaded', 'error');
        return;
      }
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("EMI Calculator - Report", 14, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Loan Type: ${loanType.toUpperCase()}`, 14, 30);
      doc.text(`Principal Amount: Rs. ${amount.toLocaleString('en-IN')}`, 14, 37);
      doc.text(`Interest Rate: ${interestRate}% p.a.`, 14, 44);
      doc.text(`Tenure: ${tenure} ${tenureType}`, 14, 51);
      doc.text(`Monthly EMI: Rs. ${Math.round(standardEmiValue).toLocaleString('en-IN')}`, 14, 58);
      doc.text(`Total Interest: Rs. ${Math.round(totalInterest).toLocaleString('en-IN')}`, 14, 65);
      doc.text(`Total Payment: Rs. ${Math.round(totalPayment).toLocaleString('en-IN')}`, 14, 72);

      const tableData = schedules.yearly.map(row => [
        row.label,
        `Rs. ${Math.round(row.emi).toLocaleString('en-IN')}`,
        `Rs. ${Math.round(row.principalPaid).toLocaleString('en-IN')}`,
        `Rs. ${Math.round(row.interestPaid).toLocaleString('en-IN')}`,
        `Rs. ${Math.round(row.endingBalance).toLocaleString('en-IN')}`
      ]);

      (doc as any).autoTable({
        startY: 80,
        head: [['Year', 'Total Payment (EMI)', 'Principal Paid', 'Interest Paid', 'Ending Balance']],
        body: tableData,
      });

      doc.save(`emi-report-${loanType}.pdf`);
      showToast(t.toastPdf || 'PDF report generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error generating PDF', 'error');
    }
  };

  const handleExportExcelClick = () => {
    try {
      const XLSX = (window as any).XLSX;
      if (!XLSX) {
        showToast('Excel library not loaded', 'error');
        return;
      }
      
      const summaryData = [
        ["EMI Calculator Summary Report"],
        [],
        ["Parameter", "Value"],
        ["Loan Type", loanType.toUpperCase()],
        ["Principal Amount (Rs.)", amount],
        ["Interest Rate (% p.a.)", interestRate],
        ["Tenure", `${tenure} ${tenureType}`],
        ["Monthly EMI (Rs.)", Math.round(standardEmiValue)],
        ["Total Interest (Rs.)", Math.round(totalInterest)],
        ["Total Payment (Rs.)", Math.round(totalPayment)],
        [],
        ["Yearly Amortization Schedule"],
        ["Year", "Total Payment (EMI)", "Principal Paid", "Interest Paid", "Ending Balance"]
      ];

      schedules.yearly.forEach(row => {
        summaryData.push([
          row.label,
          Math.round(row.emi),
          Math.round(row.principalPaid),
          Math.round(row.interestPaid),
          Math.round(row.endingBalance)
        ]);
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws, "EMI Calculation");
      XLSX.writeFile(wb, `emi-schedule-${loanType}.xlsx`);
      showToast(t.toastExcel || 'Excel spreadsheet exported successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error generating Excel', 'error');
    }
  };

  const handleShareLinkClick = () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('type', loanType);
      url.searchParams.set('amount', amount.toString());
      url.searchParams.set('rate', interestRate.toString());
      url.searchParams.set('tenure', tenure.toString());
      url.searchParams.set('tenureType', tenureType);
      
      navigator.clipboard.writeText(url.toString());
      showToast(t.toastCopied || 'Link copied to clipboard with current parameters!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error copying link', 'error');
    }
  };

  // ----------------------------------------------------
  // COMPARE CALCS
  // ----------------------------------------------------
  const emiA = calculateEMI(compAmtA, compRateA, compTenureA * 12, 'arrears');
  const payA = emiA * compTenureA * 12;
  const intA = Math.max(0, payA - compAmtA);

  const emiB = calculateEMI(compAmtB, compRateB, compTenureB * 12, 'arrears');
  const payB = emiB * compTenureB * 12;
  const intB = Math.max(0, payB - compAmtB);

  const betterSavings = Math.abs(intA - intB);
  const isBetterB = intB < intA;
  const monthlyDiff = Math.abs(emiA - emiB);

  // ----------------------------------------------------
  // ADVANCED SIMULATION CALCS
  // ----------------------------------------------------
  const advancedSimData = simulateAdvancedPrepayments({
    loanAmount: computedLoanAmount,
    interestRate: advRate,
    tenureYears: advTenureY,
    monthlyPrepayment: prepayMonthly,
    monthlyPrepaymentStart: prepayMonthlyStart,
    yearlyPrepayment: prepayYearly,
    yearlyPrepaymentStart: prepayYearlyStart,
    oneTimePrepayment: prepayOneTime,
    oneTimePrepaymentMonth: prepayOneTimeMonth
  });

  const advBaselineEMI = calculateEMI(computedLoanAmount, advRate, advTenureY * 12, 'arrears');
  const baseMonthlyOutflow = advBaselineEMI + advMaintenance + (advPropertyTax / 12) + (advHomeInsurance / 12);

  const advancedMonthlySchedules = generateSchedules(computedLoanAmount, advRate, advTenureY * 12, 'arrears');

  // ----------------------------------------------------
  // CREDIT CARD CALCS
  // ----------------------------------------------------
  const ccGstFee = ccApplyGst ? (ccProcessingFee * 0.18) : 0;
  const ccTotalImmediateFee = ccProcessingFee + ccGstFee;
  const ccMonthlyEMI = calculateEMI(ccPurchaseAmt, ccRate, ccTenureMonths, 'arrears');
  const ccTotalPayment = (ccMonthlyEMI * ccTenureMonths) + ccTotalImmediateFee;
  const ccTotalInterest = Math.max(0, (ccMonthlyEMI * ccTenureMonths) - ccPurchaseAmt);
  const ccEffectiveApr = ccRate + ((ccTotalImmediateFee / ccPurchaseAmt) * 100 * (12 / ccTenureMonths));

  // ----------------------------------------------------
  // INVESTMENT CALCULATIONS
  // ----------------------------------------------------
  let investInvested = 0;
  let investWealth = 0;
  let investReturns = 0;
  let investSchedules = {
    monthly: [] as AmortizationRow[],
    yearly: [] as AmortizationRow[],
    financialYear: [] as AmortizationRow[]
  };

  if (investmentType === 'sip') {
    const res = simulateSIP(sipAmount, sipRate, sipTenure);
    investInvested = res.invested;
    investWealth = res.wealth;
    investReturns = res.returns;
    investSchedules = {
      monthly: res.monthly.map(m => ({ period: m.period, label: m.label, emi: m.invested + m.returns, principalPaid: m.invested, interestPaid: m.returns, endingBalance: m.wealth, endingBalancePercentage: (m.invested/res.invested)*100 })),
      yearly: res.yearly.map(y => ({ period: y.period, label: y.label, emi: y.invested + y.returns, principalPaid: y.invested, interestPaid: y.returns, endingBalance: y.wealth, endingBalancePercentage: (y.invested/res.invested)*100 })),
      financialYear: res.yearly.map(y => ({ period: y.period, label: `FY ${2026 + y.period - 1}-${(2026 + y.period).toString().slice(-2)}`, emi: y.invested + y.returns, principalPaid: y.invested, interestPaid: y.returns, endingBalance: y.wealth, endingBalancePercentage: (y.invested/res.invested)*100 }))
    };
  } else if (investmentType === 'lumpsum') {
    const res = simulateLumpsum(lumpAmount, lumpRate, lumpTenure);
    investInvested = res.invested;
    investWealth = res.wealth;
    investReturns = res.returns;
    investSchedules = {
      monthly: res.monthly.map(m => ({ period: m.period, label: m.label, emi: m.invested + m.returns, principalPaid: m.invested, interestPaid: m.returns, endingBalance: m.wealth, endingBalancePercentage: 100 })),
      yearly: res.yearly.map(y => ({ period: y.period, label: y.label, emi: y.invested + y.returns, principalPaid: y.invested, interestPaid: y.returns, endingBalance: y.wealth, endingBalancePercentage: 100 })),
      financialYear: res.yearly.map(y => ({ period: y.period, label: `FY ${2026 + y.period - 1}-${(2026 + y.period).toString().slice(-2)}`, emi: y.invested + y.returns, principalPaid: y.invested, interestPaid: y.returns, endingBalance: y.wealth, endingBalancePercentage: 100 }))
    };
  } else if (investmentType === 'fd') {
    const res = simulateFD(fdAmount, fdRate, fdTenure);
    investInvested = res.invested;
    investWealth = res.wealth;
    investReturns = res.returns;
    investSchedules = {
      monthly: res.monthly.map(m => ({ period: m.period, label: m.label, emi: m.invested + m.returns, principalPaid: m.invested, interestPaid: m.returns, endingBalance: m.wealth, endingBalancePercentage: 100 })),
      yearly: res.yearly.map(y => ({ period: y.period, label: y.label, emi: y.invested + y.returns, principalPaid: y.invested, interestPaid: y.returns, endingBalance: y.wealth, endingBalancePercentage: 100 })),
      financialYear: res.yearly.map(y => ({ period: y.period, label: `FY ${2026 + y.period - 1}-${(2026 + y.period).toString().slice(-2)}`, emi: y.invested + y.returns, principalPaid: y.invested, interestPaid: y.returns, endingBalance: y.wealth, endingBalancePercentage: 100 }))
    };
  } else if (investmentType === 'rd') {
    const res = simulateRD(rdAmount, rdRate, rdTenure);
    investInvested = res.invested;
    investWealth = res.wealth;
    investReturns = res.returns;
    investSchedules = {
      monthly: res.monthly.map(m => ({ period: m.period, label: m.label, emi: m.invested + m.returns, principalPaid: m.invested, interestPaid: m.returns, endingBalance: m.wealth, endingBalancePercentage: (m.invested/res.invested)*100 })),
      yearly: res.yearly.map(y => ({ period: y.period, label: y.label, emi: y.invested + y.returns, principalPaid: y.invested, interestPaid: y.returns, endingBalance: y.wealth, endingBalancePercentage: (y.invested/res.invested)*100 })),
      financialYear: res.yearly.map(y => ({ period: y.period, label: `FY ${2026 + y.period - 1}-${(2026 + y.period).toString().slice(-2)}`, emi: y.invested + y.returns, principalPaid: y.invested, interestPaid: y.returns, endingBalance: y.wealth, endingBalancePercentage: (y.invested/res.invested)*100 }))
    };
  }

  const t = translations[lang];

  // Lookup selected article for full-page reading mode
  const activeArticle = articles.find((a) => a.id === activeArticleId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased flex flex-col justify-between transition-colors duration-300">
      
      {/* Toast elements list */}
      <div className="fixed bottom-6 left-6 z-50 space-y-2 pointer-events-none max-w-sm" id="toast-wrapper-panel">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              toast.type === 'success'
                ? 'border-emerald-100 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950 dark:text-emerald-300'
                : 'border-red-100 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950 dark:text-red-300'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span className="text-xs font-semibold">{toast.msg}</span>
          </div>
        ))}
      </div>

      {/* Dynamic top bar layout */}
      <Navbar 
        currentLang={lang}
        onLangChange={handleLangChange}
        darkMode={darkMode}
        onToggleDarkMode={toggleTheme}
        activeTab={activeTab}
        onTabChange={(tab, subType) => {
          setActiveArticleId(null);
          setActiveTab(tab);
          if (subType) {
            if (tab === 'calculator') {
              setLoanType(subType as LoanType);
            } else if (tab === 'investments') {
              setInvestmentType(subType as InvestmentType);
            }
          }
        }}
        onShowToast={showToast}
        onOpenLegalModal={openLegalModal}
      />

      {/* ======================================================================= */}
      {/* FULL-PAGE ARTICLE READING INTERFACE */}
      {/* ======================================================================= */}
      {activeArticle ? (
        <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center">
            <button
              onClick={() => {
                setActiveArticleId(null);
                // Clean URL parameters when going back
                const url = new URL(window.location.href);
                url.searchParams.delete('article');
                window.history.replaceState({}, '', url.toString());
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>{lang === 'en' ? 'Back to Calculator' : 'कैलकुलेटर पर वापस जाएं'}</span>
            </button>
          </div>

          <article className="glass-panel rounded-3xl p-6 md:p-10 space-y-6">
            <div className="border-b border-slate-200/60 pb-5 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase text-indigo-650 dark:text-indigo-400 tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>{lang === 'en' ? activeArticle.categoryEn : activeArticle.categoryHi}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
                {lang === 'en' ? activeArticle.titleEn : activeArticle.titleHi}
              </h1>
            </div>

            <div className="text-sm sm:text-base text-slate-655 dark:text-slate-300 leading-relaxed space-y-5">
              {lang === 'en' 
                ? activeArticle.paragraphsEn.map((para, i) => <p key={i}>{para}</p>)
                : activeArticle.paragraphsHi.map((para, i) => <p key={i}>{para}</p>)
              }
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified Financial Literacy Portal</span>
              <span>Last updated: June 2026</span>
            </div>
          </article>
        </main>
      ) : (
        /* ======================================================================= */
        /* STANDARD MAIN DASHBOARD PAGE (CALCULATOR + TABS) */
        /* ======================================================================= */
        <>
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-4 text-center" id="applet-hero-header">
            <h1 className="font-display text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-650 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300 sm:text-4xl md:text-5xl lg:text-6xl">
              {t.subtitle}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
              {t.trustedBy}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5" id="hero-trust-badges">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-355 border border-slate-200/50 dark:border-slate-800/80">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                {t.rbiFormula}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-355 border border-slate-200/50 dark:border-slate-800/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t.freeText}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-355 border border-slate-200/50 dark:border-slate-800/80">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                {t.noSignup}
              </span>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-8">
            
            {/* TAB 1: STANDARD EMI LOAN CALCULATOR PANEL */}
            {activeTab === 'calculator' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col" id="standard-calc-container">
                  
                  <div className="mb-8 flex overflow-x-auto gap-1 rounded-2xl bg-slate-100/60 p-1.5 dark:bg-slate-800/60 max-w-md border border-slate-200/30 dark:border-slate-800/30" id="loan-type-tabs">
                    <button
                      onClick={() => setLoanType('home')}
                      className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        loanType === 'home'
                          ? 'bg-white text-indigo-650 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      <Home className="h-3.5 w-3.5" />
                      <span>{lang === 'en' ? 'Home Loan' : 'गृह ऋण (Home)'}</span>
                    </button>
                    <button
                      onClick={() => setLoanType('car')}
                      className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        loanType === 'car'
                          ? 'bg-white text-indigo-655 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      <Car className="h-3.5 w-3.5" />
                      <span>{lang === 'en' ? 'Car Loan' : 'कार ऋण (Car)'}</span>
                    </button>
                    <button
                      onClick={() => setLoanType('personal')}
                      className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        loanType === 'personal'
                          ? 'bg-white text-indigo-655 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      <UserIcon className="h-3.5 w-3.5" />
                      <span>{lang === 'en' ? 'Personal' : 'व्यक्तिगत (Personal)'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" id="calc-two-column-block">
                    
                    <div className="lg:col-span-7 space-y-6" id="input-fields-left-col">
                      
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5 tracking-wide uppercase">
                            <span>{t.loanAmount}</span>
                            <HelpCircle className="h-3.5 w-3.5 text-slate-405 cursor-help" title="The primary loan size requested from banks." />
                          </label>
                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 font-mono text-sm font-bold text-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 transition-all">
                            <span className="text-slate-400 dark:text-slate-505 mr-1 font-semibold">₹</span>
                            <input
                              type="number"
                              placeholder="500000"
                              value={amount || ''}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                handleAmountChange(isNaN(val) ? 0 : val);
                              }}
                              className="w-32 bg-transparent text-right focus:outline-none focus:ring-0 text-[15px] font-bold"
                              min={0}
                              max={100000000}
                            />
                          </div>
                        </div>

                        <input
                          type="range"
                          min={currentAmtBounds.min}
                          max={currentAmtBounds.max}
                          step={currentAmtBounds.step}
                          value={amount}
                          onChange={(e) => handleAmountSlider(parseInt(e.target.value) || currentAmtBounds.min)}
                          className="w-full h-2 cursor-pointer rounded-lg accent-indigo-500"
                          style={{
                            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${Math.max(0, Math.min(100, ((amount - currentAmtBounds.min) / (currentAmtBounds.max - currentAmtBounds.min)) * 100))}%`,
                            backgroundColor: darkMode ? '#334155' : '#E2E8F0'
                          }}
                        />

                        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 px-1 pt-0.5">
                          {currentAmtBounds.ticks.map((tick, i) => (
                            <span 
                              key={tick} 
                              className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150" 
                              onClick={() => setAmount(tick)}
                            >
                              {lang === 'en' ? currentAmtBounds.labelsEn[i] : currentAmtBounds.labelsHi[i]}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-355 flex items-center gap-1.5 tracking-wide uppercase">
                            <span>{t.interestRate}</span>
                            <HelpCircle className="h-3.5 w-3.5 text-slate-405 cursor-help" title="Lending reducing rate from financial institutes per annum." />
                          </label>
                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 font-mono text-sm font-bold text-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 transition-all">
                            <input
                              type="number"
                              placeholder="8.5"
                              value={interestRate || ''}
                              step={0.1}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setInterestRate(isNaN(val) ? 0 : val);
                              }}
                              className="w-16 bg-transparent text-right focus:outline-none text-[15px] font-bold"
                              min={0}
                              max={30}
                            />
                            <span className="text-slate-400 dark:text-slate-505 ml-1 font-semibold">%</span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min={5}
                          max={20}
                          step={0.1}
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value) || 5)}
                          className="w-full h-2 cursor-pointer rounded-lg accent-indigo-500"
                          style={{
                            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${Math.max(0, Math.min(100, ((interestRate - 5) / (20 - 5)) * 100))}%`,
                            backgroundColor: darkMode ? '#334155' : '#E2E8F0'
                          }}
                        />

                        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 px-1 pt-0.5" id="interest-ticks">
                          <span className="cursor-pointer hover:text-indigo-500" onClick={() => setInterestRate(5)}>5%</span>
                          <span className="cursor-pointer hover:text-indigo-500" onClick={() => setInterestRate(8.5)}>8.5% (Avg)</span>
                          <span className="cursor-pointer hover:text-indigo-500" onClick={() => setInterestRate(12)}>12%</span>
                          <span className="cursor-pointer hover:text-indigo-500" onClick={() => setInterestRate(16)}>16%</span>
                          <span className="cursor-pointer hover:text-indigo-500" onClick={() => setInterestRate(20)}>20%</span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-355 tracking-wide uppercase">
                            {t.loanTenure}
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800 border border-slate-200/20 dark:border-slate-700/20">
                              <button
                                type="button"
                                onClick={() => handleTenureToggle('years')}
                                className={`rounded-md px-3 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                                  tenureType === 'years'
                                    ? 'bg-white text-indigo-650 shadow-sm dark:bg-slate-750 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                                }`}
                              >
                                {t.years}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTenureToggle('months')}
                                className={`rounded-md px-3 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                                  tenureType === 'months'
                                    ? 'bg-white text-indigo-655 shadow-sm dark:bg-slate-750 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                                }`}
                              >
                                {t.months}
                              </button>
                            </div>

                            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 font-mono text-sm font-bold text-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 transition-all">
                              <input
                                type="number"
                                placeholder="20"
                                value={tenure || ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setTenure(isNaN(val) ? 0 : val);
                                }}
                                className="w-12 bg-transparent text-right focus:outline-none text-[15px] font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <input
                          type="range"
                          min={1}
                          max={tenureType === 'years' ? 30 : 360}
                          step={1}
                          value={tenure}
                          onChange={(e) => setTenure(parseInt(e.target.value) || 1)}
                          className="w-full h-2 cursor-pointer rounded-lg accent-indigo-500"
                          style={{
                            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${Math.max(0, Math.min(100, ((tenure - 1) / ((tenureType === 'years' ? 30 : 360) - 1)) * 100))}%`,
                            backgroundColor: darkMode ? '#334155' : '#E2E8F0'
                          }}
                        />

                        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 px-1 pt-0.5">
                          {tenureType === 'years' ? (
                            <>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(1)}>1 Yr</span>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(5)}>5 Yrs</span>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(15)}>15 Yrs</span>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(25)}>25 Yrs</span>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(30)}>30 Yrs</span>
                            </>
                          ) : (
                            <>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(12)}>12 Mo</span>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(60)}>60 Mo</span>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(180)}>180 Mo</span>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(300)}>300 Mo</span>
                              <span className="cursor-pointer hover:text-indigo-500" onClick={() => setTenure(360)}>360 Mo</span>
                            </>
                          )}
                        </div>
                      </div>

                      {loanType === 'car' && (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/20 p-5 dark:border-slate-800 dark:bg-slate-900/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-335 tracking-wide uppercase">
                              {t.carLoanAdvance}
                            </span>
                            
                            <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800 border border-slate-200/20 dark:border-slate-750/20">
                              <button
                                type="button"
                                onClick={() => setCarEMIPlan('arrears')}
                                className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                  carEMIPlan === 'arrears'
                                    ? 'bg-white text-indigo-650 shadow-sm dark:bg-slate-750 dark:text-white'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {t.arrears} (Standard)
                              </button>
                              <button
                                type="button"
                                onClick={() => setCarEMIPlan('advance')}
                                className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                  carEMIPlan === 'advance'
                                    ? 'bg-white text-indigo-655 shadow-sm dark:bg-slate-750 dark:text-white'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {t.advance} (Annuity)
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            ℹ️ {carEMIPlan === 'advance' 
                              ? 'Advance schemes require the first year/month EMI at disbursement, thereby reducing interest accumulation.' 
                              : 'Arrears schemes follow standard month-end repayment patterns.'}
                          </p>
                        </div>
                      )}

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
                        <span className="block text-[11px] font-extrabold tracking-widest uppercase text-slate-400 dark:text-slate-505">
                          {t.exportShare}
                        </span>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <button
                            onClick={handleExportPDFClick}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-500/30 hover:shadow-sm active:scale-95 transition-all dark:border-slate-855 dark:bg-slate-800/60 dark:text-slate-355 dark:hover:bg-slate-800 dark:hover:border-indigo-500/20 cursor-pointer duration-200"
                          >
                            <FileDown className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
                            <span>PDF Report</span>
                          </button>

                          <button
                            onClick={handleExportExcelClick}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-500/30 hover:shadow-sm active:scale-95 transition-all dark:border-slate-855 dark:bg-slate-800/60 dark:text-slate-355 dark:hover:bg-slate-800 dark:hover:border-indigo-500/20 cursor-pointer duration-200"
                          >
                            <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-500" />
                            <span>Excel Matrix</span>
                          </button>

                          <button
                            onClick={handleShareLinkClick}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:from-indigo-555 hover:to-indigo-455 active:scale-95 transition-all cursor-pointer duration-200"
                          >
                            <Share2 className="h-4.5 w-4.5 text-white/90" />
                            <span>{t.shareLink}</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="lg:col-span-5 bg-slate-50/80 p-6 rounded-2xl dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-805/50 flex flex-col justify-between" id="results-panel-right-col">
                      
                      <div className="space-y-4" id="stat-cards-group">
                        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/20 to-indigo-100/10 p-5 dark:border-indigo-950/60 dark:from-indigo-950/20 dark:to-slate-900/40 glow-card-indigo transition-all duration-300 shadow-sm shadow-indigo-500/5">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider font-mono">
                            {t.monthlyEmi}
                          </span>
                          <p className="font-display text-3xl font-black text-indigo-655 dark:text-indigo-400 tracking-tight mt-1">
                            <AnimatedNumber value={standardEmiValue} />
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/20 to-amber-100/10 p-4.5 dark:border-amber-950/40 dark:from-amber-950/10 dark:to-slate-900/20 glow-card-amber transition-all duration-300 shadow-sm shadow-amber-500/5">
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider font-mono">
                              {t.totalInterest}
                            </span>
                            <p className="font-display text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                              <AnimatedNumber value={totalInterest} />
                            </p>
                            <span className="text-[10px] text-amber-600/80 mt-1.5 block font-semibold">
                              ({formatShortValue(totalInterest)})
                            </span>
                          </div>

                          <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/20 to-emerald-100/10 p-4.5 dark:border-emerald-950/40 dark:from-emerald-950/10 dark:to-slate-900/20 glow-card-emerald transition-all duration-300 shadow-sm shadow-emerald-500/5">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider font-mono">
                              {t.totalPayment}
                            </span>
                            <p className="font-display text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                              <AnimatedNumber value={totalPayment} />
                            </p>
                            <span className="text-[10px] text-emerald-600/80 mt-1.5 block font-semibold">
                              ({formatShortValue(totalPayment)})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-white dark:bg-slate-900/85 rounded-xl border border-slate-200/50 dark:border-slate-800/80 space-y-3.5 shadow-sm">
                        <div className="flex items-start gap-2.5 text-xs text-slate-655 dark:text-slate-400">
                          <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                          <div>
                            <p>
                              {lang === 'en' 
                                ? `Interest outlay constitutes ` 
                                : `कुल ऋण का `}
                              <strong className="text-amber-500 dark:text-amber-400 font-bold">
                                {totalPayment > 0 ? ((totalInterest / totalPayment) * 100).toFixed(0) : 0}%
                              </strong> 
                              {lang === 'en'
                                ? ` of your total payments portfolio.`
                                : ` प्रतिशत हिस्सा केवल ब्याज भुगतान है।`}
                            </p>
                          </div>
                        </div>
                        {totalPayment > 0 && (
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
                            <div 
                              className="bg-indigo-500 h-full transition-all duration-500" 
                              style={{ width: `${(amount / totalPayment) * 100}%` }}
                              title={`Principal: ${((amount / totalPayment) * 100).toFixed(0)}%`}
                            />
                            <div 
                              className="bg-amber-500 h-full transition-all duration-500" 
                              style={{ width: `${(totalInterest / totalPayment) * 100}%` }}
                              title={`Interest: ${((totalInterest / totalPayment) * 100).toFixed(0)}%`}
                            />
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>

                <LoanCharts 
                  principal={amount}
                  interest={totalInterest}
                  yearlySchedule={schedules.yearly}
                  currentLang={lang}
                />

                <AmortizationTable 
                  schedule={schedules}
                  currentLang={lang}
                />

                <FloatingRateSection 
                  amount={amount}
                  baseRate={interestRate}
                  tenureMonths={actualMonths}
                  scheme={loanType === 'car' ? carEMIPlan : 'arrears'}
                  currentLang={lang}
                />

                <BankRateTable 
                  currentLang={lang}
                  onApplyBankRate={handleApplyBankRate}
                />

              </div>
            )}

            {/* TAB 2: LOAN COMPARISON MATRIX MODULE */}
            {activeTab === 'compare' && (
              <div className="space-y-6 animate-in fade-in duration-200" id="comparison-tab-block">
                <div className="glass-panel rounded-3xl p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <TrendingUp className="h-5.5 w-5.5 text-indigo-600 dark:text-indigo-400" />
                      {t.compareHeadline}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t.compareSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/50 bg-indigo-50/5 p-5 dark:border-slate-800/80 dark:bg-slate-900/20">
                      <span className="inline-block py-1.5 px-3 text-[10px] font-extrabold text-indigo-700 bg-indigo-50/80 dark:bg-slate-800 dark:text-indigo-400 rounded-lg uppercase tracking-wider mb-4">
                        {t.scenarioA}
                      </span>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-550 block mb-1.5">Loan Amount (₹)</label>
                          <input
                            type="number"
                            value={compAmtA || ''}
                            onChange={(e) => setCompAmtA(parseInt(e.target.value, 10) || 0)}
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-850 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-550 block mb-1.5">Interest Per Annum (%)</label>
                          <input
                            type="number"
                            value={compRateA || ''}
                            step={0.1}
                            onChange={(e) => setCompRateA(parseFloat(e.target.value) || 0)}
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-555 block mb-1.5">Tenure Years</label>
                          <input
                            type="number"
                            value={compTenureA || ''}
                            onChange={(e) => setCompTenureA(parseInt(e.target.value, 10) || 0)}
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/50 bg-emerald-50/5 p-5 dark:border-slate-800/80 dark:bg-slate-900/20">
                      <span className="inline-block py-1.5 px-3 text-[10px] font-extrabold text-emerald-800 bg-emerald-50/80 dark:bg-slate-800 dark:text-emerald-400 rounded-lg uppercase tracking-wider mb-4">
                        {t.scenarioB}
                      </span>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-555 block mb-1.5">Loan Amount (₹)</label>
                          <input
                            type="number"
                            value={compAmtB || ''}
                            onChange={(e) => setCompAmtB(parseInt(e.target.value, 10) || 0)}
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-555 block mb-1.5">Interest Per Annum (%)</label>
                          <input
                            type="number"
                            value={compRateB || ''}
                            step={0.1}
                            onChange={(e) => setCompRateB(parseFloat(e.target.value) || 0)}
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-555 block mb-1.5">Tenure Years</label>
                          <input
                            type="number"
                            value={compTenureB || ''}
                            onChange={(e) => setCompTenureB(parseInt(e.target.value, 10) || 0)}
                            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-4.5 sm:grid-cols-3 border-t border-slate-100 dark:border-slate-800 pt-8">
                    <div className="p-4.5 rounded-xl border border-slate-200/50 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/40">
                      <span className="text-[10px] font-bold font-mono uppercase text-slate-505 block">{t.monthlyEmi} Comparison</span>
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-655 dark:text-slate-400">
                          Scenario A: <span className="font-mono text-base font-bold text-slate-800 dark:text-white">₹{Math.round(emiA).toLocaleString('en-IN')}</span>
                        </p>
                        <p className="text-xs font-semibold text-slate-655 dark:text-slate-400">
                          Scenario B: <span className="font-mono text-base font-bold text-slate-800 dark:text-white">₹{Math.round(emiB).toLocaleString('en-IN')}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-4.5 rounded-xl border border-slate-200/50 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/40">
                      <span className="text-[10px] font-bold font-mono uppercase text-slate-505 block">{t.totalInterest} Comparison</span>
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-655 dark:text-slate-400">
                          Scenario A: <span className="font-mono text-base font-bold text-amber-500">₹{Math.round(intA).toLocaleString('en-IN')}</span>
                        </p>
                        <p className="text-xs font-semibold text-slate-655 dark:text-slate-400">
                          Scenario B: <span className="font-mono text-base font-bold text-amber-500">₹{Math.round(intB).toLocaleString('en-IN')}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-4.5 rounded-xl border border-slate-200/50 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/40">
                      <span className="text-[10px] font-bold font-mono uppercase text-slate-505 block">{t.totalPayment} Comparison</span>
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-655 dark:text-slate-400">
                          Scenario A: <span className="font-mono text-base font-bold text-emerald-505">₹{Math.round(payA).toLocaleString('en-IN')}</span>
                        </p>
                        <p className="text-xs font-semibold text-slate-655 dark:text-slate-400">
                          Scenario B: <span className="font-mono text-base font-bold text-emerald-505">₹{Math.round(payB).toLocaleString('en-IN')}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30 dark:border-emerald-950/20 dark:bg-emerald-950/10">
                    <h4 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-400 flex items-center gap-2.5">
                      <TrendingDown className="h-4.5 w-4.5" />
                      Insight Evaluation: {t.whichIsBetter}
                    </h4>
                    <p className="mt-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {lang === 'en' ? (
                        <>
                          📁 Comparing the simulations,{' '}
                          <strong>{isBetterB ? 'Scenario B' : 'Scenario A'}</strong> is the more interest-economical choice. It saves you{' '}
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">₹{Math.round(betterSavings).toLocaleString('en-IN')}</span>{' '}
                          in lifetime interest outlay, though it will change your monthly cash outflows by{' '}
                          <span className="font-mono font-bold">₹{Math.round(monthlyDiff).toLocaleString('en-IN')}</span>{' '}
                          {emiA > emiB ? 'less' : 'more'} per month.
                        </>
                      ) : (
                        <>
                          📁 दोनों ऋण स्थितियों की तुलना करने पर,{' '}
                          <strong>{isBetterB ? 'परिदृश्य B' : 'परिदृश्य A'}</strong> अधिक ब्याज-बचत विकल्प है। यह आपको आजीवन कुल ब्याज में{' '}
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">₹{Math.round(betterSavings).toLocaleString('en-IN')}</span>{' '}
                          की बचत कराता है, हालांकि आपका हर महीने का भुगतान{' '}
                          <span className="font-mono font-bold">₹{Math.round(monthlyDiff).toLocaleString('en-IN')}</span>{' '}
                          {emiA > emiB ? 'कम' : 'अधिक'} हो जाएगा।
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ADVANCED LOAN MODULE */}
            {activeTab === 'advanced' && (
              <div className="space-y-6 animate-in fade-in duration-200" id="advanced-loan-tab">
                <div className="glass-panel rounded-3xl p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <PiggyBank className="h-5.5 w-5.5 text-indigo-650 dark:text-indigo-400" />
                      {t.advancedHeadline}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t.advancedSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/20">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">{t.homeValue} (₹)</span>
                      <input
                        type="number"
                        value={advHomeValue || ''}
                        onChange={(e) => setAdvHomeValue(parseInt(e.target.value, 10) || 0)}
                        className="mt-2 w-full bg-transparent font-mono font-bold focus:outline-none text-slate-800 dark:text-white text-sm"
                      />
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-805/85 dark:bg-slate-900/20">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Down Payment (%)</span>
                      <div className="flex items-center gap-1 mt-2">
                        <input
                          type="number"
                          value={advDownPaymentPercent || ''}
                          onChange={(e) => setAdvDownPaymentPercent(Math.min(99, parseInt(e.target.value, 10) || 0))}
                          className="w-16 bg-transparent font-mono font-bold focus:outline-none text-slate-800 dark:text-white text-sm"
                        />
                        <span className="text-xs text-slate-400 font-semibold">%</span>
                      </div>
                      <span className="block text-[10px] text-slate-500 mt-1 font-semibold">₹{computedDownPaymentVal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/15 border-l-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                      <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 block uppercase font-mono">Computed Loan Amount</span>
                      <span className="text-sm font-mono font-bold block mt-2 text-indigo-600 dark:text-indigo-400">
                        ₹{computedLoanAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[9px] text-slate-550 mt-1.5">Property minus Down Payment + Insurance</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-900/20">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">{t.interestRate} / Tenure</span>
                      <div className="flex gap-2 items-center mt-2">
                        <input
                          type="number"
                          value={advRate || ''}
                          step={0.1}
                          onChange={(e) => setAdvRate(parseFloat(e.target.value) || 0)}
                          className="w-14 bg-transparent font-mono font-bold focus:outline-none text-slate-800 dark:text-white text-sm border-r border-slate-200/50 pr-1.5"
                        />
                        <input
                          type="number"
                          value={advTenureY || ''}
                          onChange={(e) => setAdvTenureY(parseInt(e.target.value, 10) || 0)}
                          className="w-12 bg-transparent font-mono font-bold focus:outline-none text-slate-800 dark:text-white text-sm"
                        />
                        <span className="text-[10px] text-slate-405 font-semibold">Yrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-455 block mb-1.5">{t.loanInsurance} (₹)</label>
                      <input
                        type="number"
                        value={advLoanInsurance || ''}
                        onChange={(e) => setAdvLoanInsurance(parseInt(e.target.value, 10) || 0)}
                        className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-455 block mb-1.5">{t.processingFees} (%)</label>
                      <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/40">
                        <input
                          type="number"
                          value={advProcessingFeePercent || ''}
                          step={0.1}
                          onChange={(e) => setAdvProcessingFeePercent(parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none dark:text-white"
                        />
                        <span className="text-xs text-slate-400 font-bold">%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1 font-semibold">₹{computedProcessingFeeVal.toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-455 block mb-1.5">{t.propertyTax} (₹)</label>
                      <input
                        type="number"
                        value={advPropertyTax || ''}
                        onChange={(e) => setAdvPropertyTax(parseInt(e.target.value, 10) || 0)}
                        className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-xs font-semibold text-slate-805 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-455 block mb-1.5">{t.homeInsurance} (₹)</label>
                      <input
                        type="number"
                        value={advHomeInsurance || ''}
                        onChange={(e) => setAdvHomeInsurance(parseInt(e.target.value, 10) || 0)}
                        className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-xs font-semibold text-slate-805 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-455 block mb-1.5">{t.maintenance} (₹/mo)</label>
                      <input
                        type="number"
                        value={advMaintenance || ''}
                        onChange={(e) => setAdvMaintenance(parseInt(e.target.value, 10) || 0)}
                        className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-xs font-semibold text-slate-805 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-slate-100 dark:border-slate-850 pt-8">
                    <button
                      onClick={() => setIsPrepayCollapsibleOpen(!isPrepayCollapsibleOpen)}
                      className="flex w-full items-center justify-between text-left focus:outline-none cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronsUpDown className={`h-4.5 w-4.5 text-indigo-500 transition-transform duration-300 ${isPrepayCollapsibleOpen ? 'rotate-180' : ''}`} />
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                          {t.prepaymentSection}
                        </h3>
                      </div>
                      <span className="rounded-lg bg-indigo-50/80 px-3 py-1 text-[10px] font-bold text-indigo-700 dark:bg-slate-800 dark:text-indigo-400 group-hover:bg-indigo-100/80 dark:group-hover:bg-slate-700 transition-colors">
                        {isPrepayCollapsibleOpen ? 'Collapse Options' : 'Expand Options'}
                      </span>
                    </button>

                    {isPrepayCollapsibleOpen && (
                      <div className="mt-4 p-5 rounded-2xl bg-slate-50/30 border border-slate-200/60 dark:bg-slate-900/10 dark:border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                        <p className="text-xs text-slate-500 font-medium">{t.prepaymentExplain}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900/40">
                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-355 block mb-1">{t.monthlyPrepay}</label>
                            <input
                              type="number"
                              value={prepayMonthly || ''}
                              onChange={(e) => setPrepayMonthly(parseInt(e.target.value, 10) || 0)}
                              className="glass-input mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white"
                            />
                            <div className="mt-3.5 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-semibold">{t.fromMonth}</span>
                              <input
                                type="number"
                                value={prepayMonthlyStart || ''}
                                onChange={(e) => setPrepayMonthlyStart(parseInt(e.target.value, 10) || 0)}
                                className="w-12 text-center rounded border border-slate-200/80 py-1 text-[11px] font-mono font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900/40">
                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-355 block mb-1">{t.yearlyPrepay}</label>
                            <input
                              type="number"
                              value={prepayYearly || ''}
                              onChange={(e) => setPrepayYearly(parseInt(e.target.value, 10) || 0)}
                              className="glass-input mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white"
                            />
                            <div className="mt-3.5 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-semibold">{t.fromYear}</span>
                              <input
                                type="number"
                                value={prepayYearlyStart || ''}
                                onChange={(e) => setPrepayYearlyStart(parseInt(e.target.value, 10) || 0)}
                                className="w-12 text-center rounded border border-slate-200/80 py-1 text-[11px] font-mono font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900/40">
                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-355 block mb-1">{t.oneTimePrepay}</label>
                            <input
                              type="number"
                              value={prepayOneTime || ''}
                              onChange={(e) => setPrepayOneTime(parseInt(e.target.value, 10) || 0)}
                              className="glass-input mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white"
                            />
                            <div className="mt-3.5 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-semibold">{t.inMonth}</span>
                              <input
                                type="number"
                                value={prepayOneTimeMonth || ''}
                                onChange={(e) => setPrepayOneTimeMonth(parseInt(e.target.value, 10) || 0)}
                                className="w-12 text-center rounded border border-slate-200/80 py-1 text-[11px] font-mono font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                    <div className="p-4.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/40">
                      <span className="text-[10px] text-slate-405 block font-mono font-bold uppercase tracking-wider">Total Monthly Cash outflow</span>
                      <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1.5">
                        ₹{Math.round(baseMonthlyOutflow).toLocaleString('en-IN')}/mo
                      </p>
                      <span className="text-[10px] text-slate-500 block leading-normal mt-2">Includes base EMI (₹{Math.round(advBaselineEMI).toLocaleString('en-IN')}) + maintenance + taxes & property insurances</span>
                    </div>

                    {advancedSimData.savings > 0 ? (
                      <div className="p-4.5 rounded-2xl border border-emerald-100 bg-emerald-50/30 dark:border-emerald-950/20 dark:bg-emerald-950/10 md:col-span-2 glow-card-emerald transition-all duration-300">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-455 flex items-center gap-1.5 uppercase tracking-wide">
                          <TrendingDown className="h-4.5 w-4.5 text-emerald-600 animate-bounce" />
                          {t.advancedSavingsText}
                        </span>
                        
                        <p className="mt-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {lang === 'en' ? (
                            <>
                              🎉 Prepayment schedules saves you{' '}
                              <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-base">₹{Math.round(advancedSimData.savings).toLocaleString('en-IN')}</strong>{' '}
                              in total interest charges, closing your tenure{' '}
                              <strong className="text-indigo-600 dark:text-indigo-400 text-base">{advancedSimData.earlyMonths} months ({(advancedSimData.earlyMonths / 12).toFixed(1)} years) early!</strong>
                            </>
                          ) : (
                            <>
                              🎉 अतिरिक्त भुगतान योजनाओं से आपकी कुल ब्याज देनदारी में{' '}
                              <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-base">₹{Math.round(advancedSimData.savings).toLocaleString('en-IN')}</strong>{' '}
                              की कमी आएगी और आपका ऋण{' '}
                              <strong className="text-indigo-600 dark:text-indigo-400 text-base">{advancedSimData.earlyMonths} महीने</strong> पहले बंद हो जाएगा!
                            </>
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/20 md:col-span-2 flex items-center justify-center">
                        <p className="text-xs font-medium">{lang === 'en' ? 'Add prepayment details above to simulate early pay-off calculations!' : 'अतिरिक्त भुगतान योजना जोड़ें तथा जल्दी चुकौती का अभ्यास करें।'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <AmortizationTable 
                  schedule={{
                    monthly: advancedMonthlySchedules.monthly,
                    yearly: advancedMonthlySchedules.yearly,
                    financialYear: advancedMonthlySchedules.financialYear
                  }}
                  currentLang={lang}
                />
              </div>
            )}

            {/* TAB 4: CREDIT CARD EMI CALCULATOR */}
            {activeTab === 'creditcard' && (
              <div className="space-y-6 animate-in fade-in duration-200" id="credit-card-tab-block">
                <div className="glass-panel rounded-3xl p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Percent className="h-5.5 w-5.5 text-indigo-600 dark:text-indigo-400" />
                      {t.creditCardHeadline}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t.creditCardSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-7 space-y-5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wider block mb-1.5">{t.purchaseAmount} (₹)</label>
                        <input
                          type="number"
                          value={ccPurchaseAmt || ''}
                          onChange={(e) => setCcPurchaseAmt(parseInt(e.target.value, 10) || 0)}
                          className="glass-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wider block mb-1.5">{lang === 'en' ? 'Bank Interest per Annum (%)' : 'क्रेडिट कार्ड ब्याज दर (सालाना %)'}</label>
                        <input
                          type="number"
                          value={ccRate || ''}
                          step={0.1}
                          onChange={(e) => setCcRate(parseFloat(e.target.value) || 0)}
                          className="glass-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wider block">{t.loanTenure} ({t.months})</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {[3, 6, 9, 12, 18, 24].map((mo) => (
                            <button
                              key={mo}
                              onClick={() => setCcTenureMonths(mo)}
                              className={`rounded-xl py-2 px-4 text-xs font-bold transition-all duration-200 cursor-pointer ${
                                ccTenureMonths === mo
                                  ? 'bg-indigo-650 text-white shadow-md dark:bg-indigo-500 scale-[1.03]'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700'
                              }`}
                            >
                              {mo} {t.months}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1.5">Processing Fee (₹ flat)</label>
                          <input
                            type="number"
                            value={ccProcessingFee || ''}
                            onChange={(e) => setCcProcessingFee(parseInt(e.target.value, 10) || 0)}
                            className="glass-input w-full rounded-xl px-3 py-2 text-xs font-semibold text-slate-805 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-slate-50/60 p-3 mt-1.5 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 pr-3.5 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Compulsory 18% GST</span>
                            <span className="text-[9px] text-slate-500 font-semibold">Levied on bank fees</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCcApplyGst(!ccApplyGst)}
                            className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative ${ccApplyGst ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                          >
                            <div className={`h-5 w-5 rounded-full bg-white shadow-md transition-all ${ccApplyGst ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-5 bg-slate-50/80 p-6 rounded-2xl dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 flex flex-col justify-between" id="results-panel-right-col">
                      <div className="space-y-4">
                        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/20 to-indigo-100/10 p-5 dark:border-indigo-950/60 dark:from-indigo-950/20 dark:to-slate-900/40 glow-card-indigo transition-all duration-300 shadow-sm shadow-indigo-500/5">
                          <span className="text-[10px] text-indigo-650 dark:text-indigo-400 block uppercase tracking-wider font-mono font-bold">{t.monthlyEmi}</span>
                          <p className="font-display text-2xl font-black text-indigo-655 dark:text-indigo-400 tracking-tight mt-1">
                            ₹{Math.round(ccMonthlyEMI).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="space-y-2.5 text-xs border-t border-slate-200/60 dark:border-slate-800/80 pt-4">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Total bank interest paid</span>
                            <span className="font-mono font-bold text-slate-855 dark:text-white">₹{Math.round(ccTotalInterest).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Processing charges (with GST)</span>
                            <span className="font-mono font-bold text-slate-855 dark:text-white">₹{Math.round(ccTotalImmediateFee).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between border-t border-dotted border-slate-200 dark:border-slate-800 pt-2.5 text-sm font-bold">
                            <span className="text-slate-800 dark:text-slate-200">{t.totalCost}</span>
                            <span className="font-mono font-extrabold text-indigo-650 dark:text-indigo-400">₹{Math.round(ccTotalPayment).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-[11px] border-t border-slate-100 dark:border-slate-805/55 pt-2">
                            <span className="text-slate-450">Effective Annual APR</span>
                            <span className="font-mono font-bold text-amber-500">{ccEffectiveApr.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>

                      {ccPurchaseAmt > 0 && (
                        <div className="mt-6 p-4 rounded-xl border border-red-100 bg-red-50/20 dark:border-red-950/30 dark:bg-red-950/5">
                          <span className="text-[10px] font-extrabold text-red-650 tracking-widest uppercase flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {t.mrpInsight} Check
                          </span>
                          <p className="mt-2 text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                            ⚠️ Purchasing on EMI increases your retail checkout outlays by{' '}
                            <span className="text-red-650 dark:text-red-400 font-bold font-mono">
                              {((ccTotalPayment - ccPurchaseAmt) / ccPurchaseAmt * 100).toFixed(1)}%
                            </span>{' '}
                            over the flat cash checkout price (Interest extra ₹{Math.round(ccTotalInterest).toLocaleString('en-IN')} + fees).
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================================= */}
            {/* TAB 5: INVESTMENT TOOLS (SIP, FD, RD, LUMPSUM) */}
            {/* ======================================================================= */}
            {activeTab === 'investments' && (
              <div className="space-y-8 animate-in fade-in duration-200" id="investment-tab-block">
                <div className="glass-panel rounded-3xl p-6 md:p-8">
                  
                  {/* Tab options inside investments */}
                  <div className="mb-8 flex overflow-x-auto gap-1 rounded-2xl bg-slate-100/60 p-1.5 dark:bg-slate-800/60 max-w-xl border border-slate-200/30 dark:border-slate-800/30" id="investment-type-tabs">
                    <button
                      onClick={() => setInvestmentType('sip')}
                      className={`flex-1 min-w-[100px] py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        investmentType === 'sip'
                          ? 'bg-white text-indigo-650 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {t.sip}
                    </button>
                    <button
                      onClick={() => setInvestmentType('lumpsum')}
                      className={`flex-1 min-w-[100px] py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        investmentType === 'lumpsum'
                          ? 'bg-white text-indigo-650 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {t.lumpsum}
                    </button>
                    <button
                      onClick={() => setInvestmentType('fd')}
                      className={`flex-1 min-w-[100px] py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        investmentType === 'fd'
                          ? 'bg-white text-indigo-650 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {t.fd}
                    </button>
                    <button
                      onClick={() => setInvestmentType('rd')}
                      className={`flex-1 min-w-[100px] py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        investmentType === 'rd'
                          ? 'bg-white text-indigo-655 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {t.rd}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    
                    {/* Inputs panel */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Amount input */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-355 tracking-wide uppercase">
                            {investmentType === 'sip' && (lang === 'en' ? 'Monthly Investment' : 'मासिक निवेश')}
                            {investmentType === 'lumpsum' && (lang === 'en' ? 'Total Investment' : 'एकमुश्त निवेश')}
                            {investmentType === 'fd' && (lang === 'en' ? 'FD Principal Amount' : 'FD मूलधन राशि')}
                            {investmentType === 'rd' && (lang === 'en' ? 'RD Monthly Deposit' : 'RD मासिक जमा')}
                          </label>
                          
                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 font-mono text-sm font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
                            <span className="text-slate-400 dark:text-slate-505 mr-1 font-semibold">₹</span>
                            <input
                              type="number"
                              value={
                                investmentType === 'sip' ? sipAmount :
                                investmentType === 'lumpsum' ? lumpAmount :
                                investmentType === 'fd' ? fdAmount : rdAmount
                              }
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                if (investmentType === 'sip') setSipAmount(val);
                                else if (investmentType === 'lumpsum') setLumpAmount(val);
                                else if (investmentType === 'fd') setFdAmount(val);
                                else setRdAmount(val);
                              }}
                              className="w-32 bg-transparent text-right focus:outline-none focus:ring-0 text-[15px] font-bold"
                            />
                          </div>
                        </div>

                        <input
                          type="range"
                          min={investmentType === 'sip' || investmentType === 'rd' ? 500 : 5000}
                          max={investmentType === 'sip' || investmentType === 'rd' ? 1000000 : 10000000}
                          step={investmentType === 'sip' || investmentType === 'rd' ? 500 : 5000}
                          value={
                            investmentType === 'sip' ? sipAmount :
                            investmentType === 'lumpsum' ? lumpAmount :
                            investmentType === 'fd' ? fdAmount : rdAmount
                          }
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            if (investmentType === 'sip') setSipAmount(val);
                            else if (investmentType === 'lumpsum') setLumpAmount(val);
                            else if (investmentType === 'fd') setFdAmount(val);
                            else setRdAmount(val);
                          }}
                          className="w-full h-2 cursor-pointer rounded-lg accent-indigo-500"
                        />
                      </div>

                      {/* Interest / Return Rate input */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-355 tracking-wide uppercase">
                            {lang === 'en' ? 'Expected Return Rate (% p.a.)' : 'अपेक्षित रिटर्न दर (सालाना %)'}
                          </label>
                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 font-mono text-sm font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
                            <input
                              type="number"
                              value={
                                investmentType === 'sip' ? sipRate :
                                investmentType === 'lumpsum' ? lumpRate :
                                investmentType === 'fd' ? fdRate : rdRate
                              }
                              step={0.1}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                if (investmentType === 'sip') setSipRate(val);
                                else if (investmentType === 'lumpsum') setLumpRate(val);
                                else if (investmentType === 'fd') setFdRate(val);
                                else setRdRate(val);
                              }}
                              className="w-16 bg-transparent text-right focus:outline-none text-[15px] font-bold"
                            />
                            <span className="text-slate-400 dark:text-slate-505 ml-1 font-semibold">%</span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min={1}
                          max={30}
                          step={0.1}
                          value={
                            investmentType === 'sip' ? sipRate :
                            investmentType === 'lumpsum' ? lumpRate :
                            investmentType === 'fd' ? fdRate : rdRate
                          }
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            if (investmentType === 'sip') setSipRate(val);
                            else if (investmentType === 'lumpsum') setLumpRate(val);
                            else if (investmentType === 'fd') setFdRate(val);
                            else setRdRate(val);
                          }}
                          className="w-full h-2 cursor-pointer rounded-lg accent-indigo-500"
                        />
                      </div>

                      {/* Tenure / Time Period input */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-355 tracking-wide uppercase">
                            {lang === 'en' ? 'Time Period (Years)' : 'समय अवधि (वर्ष)'}
                          </label>
                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 font-mono text-sm font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
                            <input
                              type="number"
                              value={
                                investmentType === 'sip' ? sipTenure :
                                investmentType === 'lumpsum' ? lumpTenure :
                                investmentType === 'fd' ? fdTenure : rdTenure
                              }
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                if (investmentType === 'sip') setSipTenure(val);
                                else if (investmentType === 'lumpsum') setLumpTenure(val);
                                else if (investmentType === 'fd') setFdTenure(val);
                                else setRdTenure(val);
                              }}
                              className="w-16 bg-transparent text-right focus:outline-none text-[15px] font-bold"
                            />
                            <span className="text-slate-400 dark:text-slate-505 ml-1 font-semibold">Yr</span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min={1}
                          max={35}
                          step={1}
                          value={
                            investmentType === 'sip' ? sipTenure :
                            investmentType === 'lumpsum' ? lumpTenure :
                            investmentType === 'fd' ? fdTenure : rdTenure
                          }
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            if (investmentType === 'sip') setSipTenure(val);
                            else if (investmentType === 'lumpsum') setLumpTenure(val);
                            else if (investmentType === 'fd') setFdTenure(val);
                            else setRdTenure(val);
                          }}
                          className="w-full h-2 cursor-pointer rounded-lg accent-indigo-500"
                        />
                      </div>

                    </div>

                    {/* Results panel */}
                    <div className="lg:col-span-5 bg-slate-50/80 p-6 rounded-2xl dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between" id="investments-results-panel">
                      <div className="space-y-4">
                        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/20 to-indigo-100/10 p-5 dark:border-indigo-950/60 dark:from-indigo-950/20 dark:to-slate-900/40 shadow-sm">
                          <span className="text-[10px] text-indigo-650 dark:text-indigo-400 block uppercase tracking-wider font-mono font-bold">
                            {investmentType === 'fd' ? t.fdMaturityValue : investmentType === 'rd' ? t.rdMaturityValue : t.totalValue}
                          </span>
                          <p className="font-display text-2xl font-black text-indigo-655 dark:text-indigo-400 tracking-tight mt-1">
                            ₹{Math.round(investWealth).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="space-y-2.5 text-xs border-t border-slate-200/60 dark:border-slate-800/80 pt-4">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">{t.investedAmount}</span>
                            <span className="font-mono font-bold text-slate-855 dark:text-white">₹{Math.round(investInvested).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">{t.estReturns}</span>
                            <span className="font-mono font-bold text-slate-855 dark:text-white text-amber-500">₹{Math.round(investReturns).toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {investWealth > 0 && (
                          <div className="mt-6 p-4 bg-white dark:bg-slate-900/85 rounded-xl border border-slate-200/50 dark:border-slate-800/80 space-y-3.5 shadow-sm">
                            <div className="flex items-start gap-2.5 text-xs text-slate-655 dark:text-slate-400">
                              <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                              <div>
                                <p>
                                  {lang === 'en' ? 'Your investments represent ' : 'आपका मूल निवेश कुल मूल्य का '}
                                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                                    {((investInvested / investWealth) * 100).toFixed(0)}%
                                  </strong> 
                                  {lang === 'en' ? ' of total wealth accumulated.' : ' प्रतिशत हिस्सा है।'}
                                </p>
                              </div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
                              <div 
                                className="bg-indigo-500 h-full transition-all duration-500" 
                                style={{ width: `${(investInvested / investWealth) * 100}%` }}
                                title={`Invested: ${((investInvested / investWealth) * 100).toFixed(0)}%`}
                              />
                              <div 
                                className="bg-amber-500 h-full transition-all duration-500" 
                                style={{ width: `${(investReturns / investWealth) * 100}%` }}
                                title={`Returns: ${((investReturns / investWealth) * 100).toFixed(0)}%`}
                              />
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                  </div>

                </div>

                {/* Investment Charts representation */}
                <LoanCharts 
                  principal={investInvested}
                  interest={investReturns}
                  yearlySchedule={investSchedules.yearly.map(row => ({ label: row.label, principalPaid: row.principalPaid, interestPaid: row.interestPaid }))}
                  currentLang={lang}
                  mode="investment"
                />

                {/* Investment schedule list */}
                <AmortizationTable 
                  schedule={investSchedules}
                  currentLang={lang}
                />

              </div>
            )}

            {/* ======================================================================= */}
            {/* 3. DYNAMIC ARTICLES & KNOWLEDGE HUB SECTION */}
            {/* ======================================================================= */}
            <section className="mt-16 border-t border-slate-200/60 pt-12 dark:border-slate-800/60" id="articles-blog-hub">
              <div className="mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-650 dark:text-indigo-400">
                  {lang === 'en' ? 'Guides & Financial Literacy' : 'बचत गाइड और ब्लॉग'}
                </span>
                <h3 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5 sm:text-2xl lg:text-3xl">
                  {lang === 'en' ? 'RBI-Compliant Financial Literacy & Strategy Hub' : 'आरबीआई-अनुपालक वित्तीय साक्षरता और ब्लॉग'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {lang === 'en' ? 'Detailed articles to optimize home loans, compare rates and understand credit metrics.' : 'होम लोन कम करने, ब्याज दर तुलना करने और क्रेडिट स्कोर समझने के लिए विस्तृत लेख।'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((item) => (
                  <div 
                    key={item.id} 
                    className="glass-panel rounded-3xl p-5 flex flex-col justify-between hover:scale-[1.01] hover:shadow-md hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span className="uppercase tracking-wider text-indigo-600 dark:text-indigo-455">{lang === 'en' ? item.categoryEn : item.categoryHi}</span>
                        <span>{item.readTime}</span>
                      </div>
                      <h4 className="font-display text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                        {lang === 'en' ? item.titleEn : item.titleHi}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-405 line-clamp-3 leading-relaxed font-medium">
                        {lang === 'en' ? item.descriptionEn : item.descriptionHi}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <a
                        href={`?article=${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-650 hover:text-indigo-550 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                      >
                        <span>{lang === 'en' ? 'Read Full Article' : 'पूरा लेख पढ़ें'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </>
      )}

      {/* Structured Footer block */}
      <footer className="w-full bg-slate-900 py-12 text-slate-405 mt-16 border-t border-slate-950" id="fintech-global-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            
            {/* Column 1 */}
            <div>
              <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">
                {lang === 'en' ? 'About Our Calculator' : 'कैलकुलेटर के बारे में'}
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-slate-400 font-medium">
                {lang === 'en' 
                  ? 'A world-class premium fintech calculator representing official RBI reducing balance calculations. Plan your Home, Car, and Personal finances responsibly with full transparency.'
                  : 'आरबीआई द्वारा अनुमोदित घटते शेष विधि (Reducing Balance) पर आधारित प्रीमियम कैलकुलेटर। पूर्ण विश्वसनीयता के साथ अपनी वित्तीय परिसंपत्तियों की गणना करें।'}
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">Calculators</h4>
              <ul className="mt-3 space-y-2 text-xs font-semibold font-sans">
                <li><button onClick={() => { setActiveArticleId(null); setActiveTab('calculator'); setLoanType('home'); }} className="hover:text-white cursor-pointer transition-colors duration-150">Home Loan EMI</button></li>
                <li><button onClick={() => { setActiveArticleId(null); setActiveTab('calculator'); setLoanType('car'); }} className="hover:text-white cursor-pointer transition-colors duration-150">Car Loan Advance</button></li>
                <li><button onClick={() => { setActiveArticleId(null); setActiveTab('calculator'); setLoanType('personal'); }} className="hover:text-white cursor-pointer transition-colors duration-150">Personal Reducing Loan</button></li>
                <li><button onClick={() => { setActiveArticleId(null); setActiveTab('creditcard'); }} className="hover:text-white cursor-pointer transition-colors duration-150">Credit Purchase EMI Converter</button></li>
              </ul>
            </div>

            {/* Column 3 - Clickable links powered dynamically by articles database */}
            <div>
              <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">Articles & Info</h4>
              <ul className="mt-3 space-y-2.5 text-xs font-semibold">
                {articles.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={`?article=${item.id}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors block duration-150"
                    >
                      💡 {lang === 'en' ? item.titleEn : item.titleHi}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">
                {lang === 'en' ? 'Legal & Trust Help' : 'कानूनी एवं सहायता'}
              </h4>
              <ul className="mt-3 space-y-2.5 text-xs font-sans">
                <li>
                  <button 
                    onClick={() => openLegalModal('privacy')} 
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left font-bold"
                  >
                    🔐 {lang === 'en' ? 'Privacy Policy & Cookies' : 'गोपनीयता नीति (कुकीज़)'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openLegalModal('terms')} 
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left font-bold"
                  >
                    📝 {lang === 'en' ? 'Terms & Disclaimer' : 'उपयोग की शर्तें (अस्वीकरण)'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openLegalModal('contact')} 
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left font-bold"
                  >
                    ✉️ {lang === 'en' ? 'Contact & Feedback' : 'प्रतिक्रिया एवं संपर्क करें'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openLegalModal('terms')} 
                    className="text-slate-500 hover:text-slate-400 transition-colors text-left text-[11px]"
                  >
                    💡 {lang === 'en' ? 'Estimates only. Not financial advice.' : 'केवल एक अनुमान। वित्तीय सलाह नहीं।'}
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-505 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            <span>
              &copy; {new Date().getFullYear()} EMI Calculator India Premium. All rights reserved. Built with pride under RBI fair guidance metrics.
            </span>
            <div className="flex gap-4">
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                RBI Benchmarked Compliance Verified
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Trust & Legal Disclosure overlays */}
      <LegalModals
        currentLang={lang}
        isOpen={isLegalModalOpen}
        type={legalModalType}
        onClose={() => { setIsLegalModalOpen(false); setLegalModalType(null); }}
        onShowToast={showToast}
      />

    </div>
  );
}
