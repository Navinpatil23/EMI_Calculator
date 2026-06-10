import React, { useState } from 'react';
import { AmortizationRow, Language, translations } from '../types';
import { Table, Calendar, Eye, EyeOff } from 'lucide-react';

interface AmortizationTableProps {
  schedule: {
    monthly: AmortizationRow[];
    yearly: AmortizationRow[];
    financialYear: AmortizationRow[];
  };
  currentLang: Language;
}

export default function AmortizationTable({ schedule, currentLang }: AmortizationTableProps) {
  const [viewType, setViewType] = useState<'monthly' | 'yearly' | 'financialYear'>('yearly');
  const [visibleRowsCount, setVisibleRowsCount] = useState<number>(12);

  const t = translations[currentLang];
  const activeRows = schedule[viewType] || [];
  const showedAll = visibleRowsCount >= activeRows.length;

  const handleLoadMore = () => {
    setVisibleRowsCount((prev) => Math.min(prev + 12, activeRows.length));
  };

  const handleLoadAll = () => {
    setVisibleRowsCount(activeRows.length);
  };

  const handleCollapse = () => {
    setVisibleRowsCount(12);
  };

  // Logic to determine remaining balance color coding
  const getBalanceBadgeStyle = (percentage: number) => {
    if (percentage < 25) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-450 dark:border-emerald-900/40 font-bold';
    } else if (percentage <= 75) {
      return 'bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-450 dark:border-amber-900/40 font-semibold';
    } else {
      return 'bg-slate-50 text-slate-650 border-slate-200/60 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/40';
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-sm" id="amortization-table-root">
      
      {/* Table Title and View Switchers */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Table className="h-5.5 w-5.5 text-indigo-650 dark:text-indigo-400" />
            {t.amortizationSchedule}
          </h3>
          <p className="mt-1 text-xs text-slate-550 dark:text-slate-400 font-medium">
            {currentLang === 'en' 
              ? 'Detailed schedule of your repayments separated by choices' 
              : 'आपके ईएमआई भुगतानों की विस्तृत विवरण सूची'}
          </p>
        </div>

        {/* Pillar pill-style view changers */}
        <div className="flex flex-wrap gap-1 rounded-2xl bg-slate-100/60 p-1.5 dark:bg-slate-800/60 border border-slate-200/20 dark:border-slate-705/25" id="table-schedule-toggle">
          <button
            onClick={() => { setViewType('monthly'); setVisibleRowsCount(12); }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
              viewType === 'monthly'
                ? 'bg-white text-indigo-650 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.monthlyView}
          </button>
          <button
            onClick={() => { setViewType('yearly'); setVisibleRowsCount(12); }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
              viewType === 'yearly'
                ? 'bg-white text-indigo-650 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.yearlyView}
          </button>
          <button
            onClick={() => { setViewType('financialYear'); setVisibleRowsCount(12); }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
              viewType === 'financialYear'
                ? 'bg-white text-indigo-650 shadow-md scale-[1.02] dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.fyView}
          </button>
        </div>
      </div>

      {/* Actual Data Table Responsive Wrapper */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800/80 max-h-[500px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed min-w-[640px]">
          <thead className="sticky top-0 z-10 bg-slate-100/90 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-350 shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
            <tr>
              <th className="px-5 py-4 w-16 text-center">#</th>
              <th className="px-5 py-4 w-40">{t.period}</th>
              <th className="px-5 py-4">{t.emi}</th>
              <th className="px-5 py-4">{t.principal}</th>
              <th className="px-5 py-4">{t.interest}</th>
              <th className="px-5 py-4 w-52">{t.balance}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150/40 dark:divide-slate-800/60 text-xs">
            {activeRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                  {currentLang === 'en' ? 'No amortization schedule data' : 'कोई डेटा उपलब्ध नहीं है'}
                </td>
              </tr>
            ) : (
              activeRows.slice(0, visibleRowsCount).map((row, idx) => (
                <tr
                  key={row.period + '-' + idx}
                  className="hover:bg-slate-100/40 transition-colors duration-150 odd:bg-slate-50/20 dark:hover:bg-slate-800/20 dark:odd:bg-slate-900/10"
                >
                  <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-400">
                    {row.period}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{row.label}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ₹{Math.round(row.emi).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-medium text-slate-650 dark:text-slate-400">
                    ₹{Math.round(row.principalPaid).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-medium text-amber-600 dark:text-amber-400">
                    ₹{Math.round(row.interestPaid).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        ₹{Math.round(row.endingBalance).toLocaleString('en-IN')}
                      </span>
                      <span className={`inline-block shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-mono border ${getBalanceBadgeStyle(row.endingBalancePercentage)}`}>
                        {row.endingBalancePercentage.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Actions Drawer */}
      {activeRows.length > 12 && (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 py-1 border-t border-slate-100 dark:border-slate-800/80 pt-4" id="table-pagination-row">
          <span className="font-medium">
            {currentLang === 'en'
              ? `Showing ${Math.min(visibleRowsCount, activeRows.length)} of ${activeRows.length} rows`
              : `${activeRows.length} में से ${Math.min(visibleRowsCount, activeRows.length)} पंक्तियाँ दिखाई जा रही हैं`}
          </span>

          <div className="flex gap-2 flex-wrap">
            {!showedAll ? (
              <>
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-500/20 transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-750 active:scale-95 duration-200 shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{t.loadMore}</span>
                </button>
                <button
                  onClick={handleLoadAll}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-all cursor-pointer active:scale-95 duration-200 shadow-sm"
                >
                  {t.loadAll}
                </button>
              </>
            ) : (
              <button
                onClick={handleCollapse}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-500/20 transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-800 dark:text-slate-350 active:scale-95 duration-200 shadow-sm"
              >
                <EyeOff className="h-3.5 w-3.5 text-indigo-550" />
                <span>{currentLang === 'en' ? 'Show Less' : 'संक्षिप्त रूप दिखाएं'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
