/**
 * Type & Dictionary Definitions for the EMI Calculator Product.
 */

export type Language = 'en' | 'hi';
export type LoanType = 'home' | 'car' | 'personal';
export type TenureType = 'years' | 'months';
export type AppTab = 'calculator' | 'compare' | 'advanced' | 'creditcard' | 'investments';
export type InvestmentType = 'sip' | 'lumpsum' | 'fd' | 'rd';

export interface AmortizationRow {
  period: number; // Month or year number
  label: string; // e.g., "Month 1" or "Year 1" or "FY 2026-27"
  emi: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
  endingBalancePercentage: number;
}

export interface BankInfo {
  name: string;
  currentRate: number;
  minRate: number;
  processingFee: string;
}

export interface AdvancedInputs {
  homeValue: number;
  downPaymentPercent: number;
  downPaymentValue: number;
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  loanInsurance: number;
  processingFeesPercent: number;
  processingFeesValue: number;
  propertyTaxYearly: number;
  homeInsuranceYearly: number;
  monthlyMaintenance: number;
  
  // Prepayments
  monthlyPrepayment: number;
  monthlyPrepaymentStart: number;
  yearlyPrepayment: number;
  yearlyPrepaymentStart: number;
  oneTimePrepayment: number;
  oneTimePrepaymentMonth: number;
}

export interface CreditCardInputs {
  purchaseAmount: number;
  interestRate: number;
  tenureMonths: number;
  processingFeeValue: number;
  applyGst: boolean;
}

// Full dictionary translations to support both English and Hindi options
export const translations = {
  en: {
    title: "EMI Calculator",
    subtitle: "Calculate your loan EMI in seconds",
    trustedBy: "Trusted by 10 lakh+ borrowers across India",
    rbiFormula: "RBI Formula",
    freeText: "100% Free",
    noSignup: "No Sign-up",
    home: "Home Loan Calculator",
    compareTab: "Compare Loans",
    advancedTab: "Advanced Home Loan",
    creditCardTab: "Credit Card EMI",
    loanAmount: "Loan Amount",
    interestRate: "Interest Rate",
    loanTenure: "Loan Tenure",
    years: "Years",
    months: "Months",
    monthlyEmi: "Monthly EMI",
    totalInterest: "Total Interest",
    totalPayment: "Total Payment",
    carLoanAdvance: "EMI Scheme",
    advance: "Advance",
    arrears: "Arrears",
    principalvsInterest: "Principal vs Interest Breakup",
    principal: "Principal Amount",
    interest: "Interest Amount",
    amortizationSchedule: "Amortization Schedule",
    monthlyView: "Monthly View",
    yearlyView: "Yearly View",
    fyView: "Financial Year (Apr-Mar)",
    period: "Period",
    emi: "EMI",
    balance: "Remaining Balance",
    loadMore: "Load More Rows",
    loadAll: "Show All Rows",
    exportShare: "Export & Share Current Calculation",
    downloadPdf: "Download PDF Report",
    downloadExcel: "Download Excel Spreadsheet",
    shareLink: "Copy Share Link",
    toastCopied: "Link copied to clipboard with current parameters!",
    toastPdf: "PDF report generated successfully!",
    toastExcel: "Excel spreadsheet exported successfully!",
    toastPrepopulate: "Calculator values loaded from chosen bank rate!",
    toastInvalid: "Please verify input values are in active ranges.",
    compareHeadline: "Side-by-side Loan Comparison",
    compareSubtitle: "Configure two scenarios to see which fits your budget and saves more on interest.",
    scenarioA: "Scenario A",
    scenarioB: "Scenario B",
    interestPaidTitle: "Total Interest Comparison",
    whichIsBetter: "Which is better?",
    advancedHeadline: "Advanced Home Loan Calculator",
    advancedSubtitle: "Get a comprehensive calculation containing down payments, property taxes, maintenance fees, and prepayment interest-saving models.",
    homeValue: "Property Home Value",
    downPayment: "Down Payment",
    loanInsurance: "Loan Insurance (HLPP)",
    processingFees: "Processing Fees",
    propertyTax: "Yearly Property Tax",
    homeInsurance: "Yearly Home Insurance",
    maintenance: "Monthly Maintenance",
    prepaymentSection: "Prepayment Model & Early Closure (Interest Saving)",
    prepaymentExplain: "Add prepayment schedules below to see how early you can close your loan and how much interest is saved.",
    monthlyPrepay: "Monthly Prepayment Amount",
    fromMonth: "Starts from Month",
    yearlyPrepay: "Yearly Prepayment Amount",
    fromYear: "Starts from Year",
    oneTimePrepay: "One-Time Prepayment Amount",
    inMonth: "In Month Number",
    advancedSavingsText: "Prepayment Insight",
    creditCardHeadline: "Credit Card EMI Calculator",
    creditCardSubtitle: "Calculate EMIs on major store/card purchases with banks' annual rates, processing fees, and GST impact.",
    purchaseAmount: "Purchase Value",
    gstOnFees: "Apply 18% GST on Processing Fees",
    totalCost: "Total Purchase cost with Interest",
    mrpInsight: "MRP Insight",
    liveBankRates: "Live Premium Bank Interest Rates (India)",
    liveBankRatesUpdate: "Last updated on June 10, 2026. Official bank lending benchmark rates.",
    bankName: "Bank Name",
    benchmarkRate: "Current Key Rate",
    rangeRate: "Min-Max Rate Range",
    applyBankRate: "Calculate EMI",
    floatingScenario: "Floating Rate Interest Fluctuations",
    floatingSubtitle: "See how your repayments shift with market shifts (RBI repo rate fluctuations ±2%).",
    optimisticScenario: "Optimistic Scenario (-2.00%)",
    pessimisticScenario: "Pessimistic Scenario (+2.00%)",
    currentScenario: "Current Setup",
    difference: "Difference",
    savings: "Savings",
    extraCost: "Extra Cost",
    aiAdvisor: "AI Loan Financial Advisor (Rule-Based)",
    aiAdvisorPlaceholder: "Ask anything — e.g. 'Explain EMI' or 'How calculations work'",
    aiAdvisorSubmit: "Ask Advisor",
    getAppButton: "Get App",
    lakhs: "Lakhs",
    crore: "Crore",
    k: "K",
    investmentsTab: "Investment Tools",
    sip: "SIP Calculator",
    lumpsum: "Lumpsum Calculator",
    fd: "Fixed Deposit (FD)",
    rd: "Recurring Deposit (RD)",
    monthlyInvestment: "Monthly Investment",
    expectedReturnRate: "Expected Return Rate (% p.a.)",
    investedAmount: "Invested Amount",
    estReturns: "Est. Returns",
    totalValue: "Total Value",
    fdMaturityValue: "FD Maturity Value",
    rdMaturityValue: "RD Maturity Value"
  },
  hi: {
    title: "ईएमआई कैलकुलेटर",
    subtitle: "सेकंडों में अपने ऋण ईएमआई की गणना करें",
    trustedBy: "पूरे भारत में 10 लाख से अधिक उधारकर्ताओं द्वारा विश्वसनीय",
    rbiFormula: "आरबीआई फॉर्मूला",
    freeText: "100% मुफ्त",
    noSignup: "कोई साइन-अप नहीं",
    home: "होम लोन कैलकुलेटर",
    compareTab: "ऋण तुलना करें",
    advancedTab: "उन्नत होम लोन",
    creditCardTab: "क्रेडिट कार्ड ईएमआई",
    loanAmount: "ऋण राशि",
    interestRate: "ब्याज दर",
    loanTenure: "ऋण अवधि",
    years: "वर्ष",
    months: "महीने",
    monthlyEmi: "मासिक ईएमआई",
    totalInterest: "कुल ब्याज",
    totalPayment: "कुल भुगतान",
    carLoanAdvance: "ईएमआई योजना",
    advance: "अग्रिम (Advance)",
    arrears: "बकाया (Arrears)",
    principalvsInterest: "मूलधन बनाम ब्याज का विवरण",
    principal: "मूलधन की राशि",
    interest: "ब्याज की राशि",
    amortizationSchedule: "ऋण अदायगी सूची (Amortization)",
    monthlyView: "मासिक दृश्य",
    yearlyView: "वार्षिक दृश्य",
    fyView: "वित्तीय वर्ष (अप्रैल-मार्च)",
    period: "अवधि",
    emi: "ईएमआई",
    balance: "शेष ऋण राशि",
    loadMore: "और पंक्तियाँ दिखाएं",
    loadAll: "सभी पंक्तियाँ दिखाएं",
    exportShare: "वर्तमान गणना का निर्यात और साझा करें",
    downloadPdf: "PDF रिपोर्ट डाउनलोड करें",
    downloadExcel: "Excel पत्रक निर्यात करें",
    shareLink: "शेयर लिंक कॉपी करें",
    toastCopied: "वर्तमान पैरामीटर्स के साथ लिंक क्लिपबोर्ड पर कॉपी हो गया!",
    toastPdf: "PDF रिपोर्ट सफलतापूर्वक तैयार की गई!",
    toastExcel: "Excel स्प्रेडशीट सफलतापूर्वक निर्यात की गई!",
    toastPrepopulate: "चयनित बैंक दर से कैलकुलेटर में डेटा भरा गया!",
    toastInvalid: "कृपया सत्यापित करें कि इनपुट सक्रिय सीमा में हैं।",
    compareHeadline: "ऋण तुलना (साइड-बाय-साइड)",
    compareSubtitle: "यह देखने के लिए दो परिदृश्य कॉन्फ़िगर करें कि कौन सा आपके बजट में आता है और ब्याज बचाता है।",
    scenarioA: "परिदृश्य A",
    scenarioB: "परिदृश्य B",
    interestPaidTitle: "कुल ब्याज का तुलना चार्ट",
    whichIsBetter: "कौन सा बेहतर है?",
    advancedHeadline: "उन्नत होम लोन कैलकुलेटर",
    advancedSubtitle: "डाउन पेमेंट, संपत्ति कर, रखरखाव शुल्क और प्रीपेमेंट ब्याज बचत श्रेणियों के साथ विस्तृत गणना प्राप्त करें।",
    homeValue: "संपत्ति का बाजार मूल्य",
    downPayment: "डाउन पेमेंट (अग्रिम)",
    loanInsurance: "ऋण बीमा (HLPP)",
    processingFees: "प्रोसेसिंग शुल्क",
    propertyTax: "वार्षिक संपत्ति कर",
    homeInsurance: "वार्षिक गृह बीमा",
    maintenance: "मासिक रखरखाव शुल्क",
    prepaymentSection: "समय-पूर्व बंद करने का मॉडल (ब्याज बचत विवरण)",
    prepaymentExplain: "यह देखने के लिए नीचे प्रीपेमेंट शेड्यूल दर्ज करें कि आप कितनी जल्दी ऋण बंद कर सकते हैं और कितना ब्याज बचाया जा सकता है।",
    monthlyPrepay: "मासिक अतिरिक्त प्रीपेमेंट",
    fromMonth: "किस महीने से शुरू करें",
    yearlyPrepay: "वार्षिक अतिरिक्त प्रीपेment",
    fromYear: "किस वर्ष से शुरू करें",
    oneTimePrepay: "एक-बारगी एकमुश्त प्रीपेमेंट",
    inMonth: "किस महीने की संख्या में",
    advancedSavingsText: "प्रीपेमेंट इनसाइट",
    creditCardHeadline: "क्रेडिट कार्ड ईएमआई कैलकुलेटर",
    creditCardSubtitle: "बैंकों की वार्षिक दरों, प्रसंस्करण शुल्क और जीएसटी प्रभाव के साथ ईएमआई की गणना करें।",
    purchaseAmount: "खरीदारी का मूल्य",
    gstOnFees: "प्रोसेसिंग शुल्क पर 18% जीएसटी लागू करें",
    totalCost: "ब्याज सहित खरीदारी की कुल लागत",
    mrpInsight: "एमआरपी इनसाइट",
    liveBankRates: "भारत के प्रमुख बैंकों की ब्याज दरें",
    liveBankRatesUpdate: "अंतिम बार 10 जून 2026 को अपडेट किया गया। अधिकारिक बेंचमार्क दरें।",
    bankName: "बैंक का नाम",
    benchmarkRate: "वर्तमान मुख्य दर",
    rangeRate: "न्यूनतम-अधिकतम रेंज",
    applyBankRate: "EMI की गणना करें",
    floatingScenario: "बदलती (फ्लोटिंग) ब्याज दर का प्रभाव",
    floatingSubtitle: "देखें कि बाजार की स्थितियों में बदलाव (आरबीआई रेपो रेट उतार-चढ़ाव ±2%) के साथ आपकी ब्याज भुगतान कैसे बदलता है।",
    optimisticScenario: "सकारात्मक परिदृश्य (-2.00%)",
    pessimisticScenario: "नकारात्मक परिदृश्य (+2.00%)",
    currentScenario: "वर्तमान सेटअप",
    difference: "अंतर",
    savings: "बचत",
    extraCost: "अतिरिक्त लागत",
    aiAdvisor: "एआई ऋण वित्तीय सलाहकार (नियम-आधारित)",
    aiAdvisorPlaceholder: "कुछ भी पूछें - जैसे 'EMI क्या है' या 'गणना कैसे काम करती है'",
    aiAdvisorSubmit: "सलाहकार से पूछें",
    getAppButton: "ऐप डाउनलोड",
    lakhs: "लाख",
    crore: "करोड़",
    k: "हज़ार",
    investmentsTab: "निवेश टूल्स",
    sip: "एसआईपी (SIP) कैलकुलेटर",
    lumpsum: "एकमुश्त (Lumpsum) निवेश",
    fd: "फिक्स्ड डिपॉजिट (FD)",
    rd: "आरडी (RD) कैलकुलेटर",
    monthlyInvestment: "मासिक निवेश",
    expectedReturnRate: "अपेक्षित रिटर्न दर (सालाना %)",
    investedAmount: "कुल निवेशित राशि",
    estReturns: "अनुमानित रिटर्न",
    totalValue: "कुल संपत्ति मूल्य",
    fdMaturityValue: "FD परिपक्वता मूल्य",
    rdMaturityValue: "RD परिपक्वता मूल्य"
  }
};
