import React from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, BarChart } from 'lucide-react';
import { calculateEMI } from '../utils';
import { Language, translations } from '../types';

interface FloatingRateSectionProps {
  amount: number;
  baseRate: number;
  tenureMonths: number;
  scheme: 'advance' | 'arrears';
  currentLang: Language;
}

export default function FloatingRateSection({
  amount,
  baseRate,
  tenureMonths,
  scheme,
  currentLang,
}: FloatingRateSectionProps) {
  const t = translations[currentLang];

  // Base interest rates
  const currentEmi = calculateEMI(amount, baseRate, tenureMonths, scheme);
  const currentTotalPayment = currentEmi * tenureMonths;
  const currentTotalInterest = Math.max(0, currentTotalPayment - amount);

  // Optimistic rate drop (-2.00%)
  const optRate = Math.max(0.5, baseRate - 2);
  const optEmi = calculateEMI(amount, optRate, tenureMonths, scheme);
  const optTotalPayment = optEmi * tenureMonths;
  const optTotalInterest = Math.max(0, optTotalPayment - amount);
  const optEmiSavings = Math.max(0, currentEmi - optEmi);
  const optInterestSavings = Math.max(0, currentTotalInterest - optTotalInterest);

  // Pessimistic rate spike (+2.00%)
  const pesRate = Math.min(25, baseRate + 2);
  const pesEmi = calculateEMI(amount, pesRate, tenureMonths, scheme);
  const pesTotalPayment = pesEmi * tenureMonths;
  const pesTotalInterest = Math.max(0, pesTotalPayment - amount);
  const pesEmiExtra = Math.max(0, pesEmi - currentEmi);
  const pesInterestExtra = Math.max(0, pesTotalInterest - currentTotalInterest);

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-sm" id="floating-rate-fluctuation-section">
      <div className="mb-6">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-indigo-650 dark:text-indigo-400" />
          {t.floatingScenario}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {t.floatingSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Optimistic */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/20 p-5 dark:border-slate-800 dark:bg-slate-900/40 shadow-sm glow-card-emerald transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-450 uppercase tracking-wide">
              {t.optimisticScenario}
            </span>
            <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 shadow-sm">
              <ArrowDownRight className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-bold tracking-wider">Interest Rate</span>
            <span className="font-display text-2xl font-extrabold text-emerald-650 dark:text-emerald-400">{optRate.toFixed(2)}%</span>
          </div>
          <div className="mt-3 text-xs space-y-1">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {t.emi}: <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹{Math.round(optEmi).toLocaleString('en-IN')}</span>
            </p>
            <p className="text-slate-600 dark:text-slate-450 font-medium">
              {currentLang === 'en' ? 'Total Interest' : 'कुल ब्याज'}: <span className="font-mono font-semibold">₹{Math.round(optTotalInterest).toLocaleString('en-IN')}</span>
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-1 rounded-xl bg-emerald-500/10 p-3 text-[10px] text-emerald-800 dark:text-emerald-400 font-bold border border-emerald-500/10 shadow-sm">
            <span>🎉 {currentLang === 'en' ? 'EMI Savings' : 'मासिक बचत'}: ₹{Math.round(optEmiSavings).toLocaleString('en-IN')}/mo</span>
            <span>💰 {currentLang === 'en' ? 'Interest Savings' : 'कुल ब्याज बचत'}: ₹{Math.round(optInterestSavings).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Current setup */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/5 p-5 dark:border-indigo-900/60 dark:bg-slate-900/60 shadow-sm glow-card-indigo transition-all duration-300 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-755 dark:text-indigo-400 uppercase tracking-wide">
              {t.currentScenario}
            </span>
            <span className="flex h-6.5 w-6.5 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 shadow-sm">
              <BarChart className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-bold tracking-wider">Interest Rate</span>
            <span className="font-display text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{baseRate}%</span>
          </div>
          <div className="mt-3 text-xs space-y-1">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {t.emi}: <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹{Math.round(currentEmi).toLocaleString('en-IN')}</span>
            </p>
            <p className="text-slate-600 dark:text-slate-455 font-medium">
              {currentLang === 'en' ? 'Total Interest' : 'कुल ब्याज'}: <span className="font-mono font-semibold">₹{Math.round(currentTotalInterest).toLocaleString('en-IN')}</span>
            </p>
          </div>
          <p className="mt-5 text-[10px] text-slate-400 dark:text-slate-550 text-center italic font-semibold">
            {currentLang === 'en' ? 'Reference current plan setup' : 'संदर्भ स्तर परिदृश्य'}
          </p>
        </div>

        {/* Pessimistic */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/20 p-5 dark:border-slate-800 dark:bg-slate-900/40 shadow-sm glow-card-rose transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-450 uppercase tracking-wide">
              {t.pessimisticScenario}
            </span>
            <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-rose-100 text-rose-755 dark:bg-rose-950 dark:text-rose-400 shadow-sm">
              <ArrowUpRight className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-bold tracking-wider">Interest Rate</span>
            <span className="font-display text-2xl font-extrabold text-rose-650 dark:text-rose-400">{(pesRate).toFixed(2)}%</span>
          </div>
          <div className="mt-3 text-xs space-y-1">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {t.emi}: <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹{Math.round(pesEmi).toLocaleString('en-IN')}</span>
            </p>
            <p className="text-slate-600 dark:text-slate-455 font-medium">
              {currentLang === 'en' ? 'Total Interest' : 'कुल ब्याज'}: <span className="font-mono font-semibold">₹{Math.round(pesTotalInterest).toLocaleString('en-IN')}</span>
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-1 rounded-xl bg-rose-500/10 p-3 text-[10px] text-rose-800 dark:text-rose-400 font-bold border border-rose-500/10 shadow-sm">
            <span>⚠️ {currentLang === 'en' ? 'EMI Extra' : 'अतिरिक्त भुगतान'}: +₹{Math.round(pesEmiExtra).toLocaleString('en-IN')}/mo</span>
            <span>📈 {currentLang === 'en' ? 'Total Extra Cost' : 'कुल अतिरिक्त हानि'}: +₹{Math.round(pesInterestExtra).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
