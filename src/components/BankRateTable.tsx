import React from 'react';
import { Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { translations, BankInfo, Language } from '../types';

interface BankRateTableProps {
  currentLang: Language;
  onApplyBankRate: (rate: number, name: string) => void;
}

export default function BankRateTable({ currentLang, onApplyBankRate }: BankRateTableProps) {
  const banks: BankInfo[] = [
    { name: 'State Bank of India (SBI)', currentRate: 8.40, minRate: 8.40, processingFee: '₹0 / Nil (Campaign Offer)' },
    { name: 'HDFC Bank', currentRate: 8.75, minRate: 8.70, processingFee: '0.50% of loan amount' },
    { name: 'ICICI Bank', currentRate: 8.65, minRate: 8.60, processingFee: '₹3,000 flat + GST' },
    { name: 'Axis Bank', currentRate: 8.75, minRate: 8.70, processingFee: 'Up to 1.00%' },
    { name: 'Kotak Mahindra Bank', currentRate: 8.70, minRate: 8.65, processingFee: '0.50% flat' },
    { name: 'Bank of Baroda (BoB)', currentRate: 8.45, minRate: 8.40, processingFee: '₹1,500 maximum cap' },
    { name: 'LIC Housing Finance (LICHFL)', currentRate: 8.50, minRate: 8.45, processingFee: '₹2,500 - ₹5,000' },
    { name: 'PNB Housing Finance', currentRate: 8.80, minRate: 8.75, processingFee: '0.25% of loan amount' },
  ];

  const t = translations[currentLang];

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-sm" id="bank-rate-table-section">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Landmark className="h-5.5 w-5.5 text-indigo-650 dark:text-indigo-400" />
            {t.liveBankRates}
          </h3>
          <p className="mt-1 text-xs text-slate-550 dark:text-slate-400 font-medium">
            {t.liveBankRatesUpdate}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 self-start sm:self-center border border-emerald-200/20 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{currentLang === 'en' ? 'RBI Repo Rate Linked' : 'आरबीआई रेपो दर से लिंक'}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800/80 custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/80 text-xs font-bold text-slate-700 dark:bg-slate-800/80 dark:text-slate-350 border-b border-slate-200/50 dark:border-slate-800/50">
              <th className="px-5 py-4 first:rounded-tl-2xl">{t.bankName}</th>
              <th className="px-5 py-4">{t.benchmarkRate}</th>
              <th className="px-5 py-4">{t.rangeRate}</th>
              <th className="px-5 py-4">{currentLang === 'en' ? 'Processing Fee' : 'प्रोसेसिंग शुल्क'}</th>
              <th className="px-5 py-4 last:rounded-tr-2xl text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150/40 dark:divide-slate-800/60 text-sm">
            {banks.map((bank) => (
              <tr 
                key={bank.name} 
                className="hover:bg-slate-100/40 dark:hover:bg-slate-800/20 transition-colors duration-150"
              >
                <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-250 flex items-center gap-3">
                  <div className="hidden h-8 w-8 sm:flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 font-mono text-[10px] font-extrabold text-indigo-700 dark:from-slate-800 dark:to-slate-750 dark:text-indigo-400 border border-indigo-200/20 shadow-sm">
                    {bank.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="block">{bank.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono font-black text-indigo-650 dark:text-indigo-400 text-[15px]">
                  {bank.currentRate.toFixed(2)}%
                </td>
                <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {bank.minRate.toFixed(2)}% - {(bank.currentRate + 1.25).toFixed(2)}%
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-450">
                  {bank.processingFee}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onApplyBankRate(bank.currentRate, bank.name);
                    }}
                    className="group inline-flex items-center gap-1.5 rounded-xl bg-indigo-50/80 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white shadow-sm active:scale-95 duration-200"
                  >
                    <span>{t.applyBankRate}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
