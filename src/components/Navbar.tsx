import React, { useState } from 'react';
import { Calculator, Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { Language, AppTab } from '../types';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
  onOpenLegalModal: (type: 'privacy' | 'terms' | 'contact') => void;
}

export default function Navbar({
  currentLang,
  onLangChange,
  darkMode,
  onToggleDarkMode,
  activeTab,
  onTabChange,
  onShowToast,
  onOpenLegalModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppTab; labelEn: string; labelHi: string }[] = [
    { id: 'calculator', labelEn: 'Home | Loan Calculator', labelHi: 'होम | मूल ईएमआई' },
    { id: 'compare', labelEn: 'Compare Loans', labelHi: 'ऋण तुलना' },
    { id: 'advanced', labelEn: 'Advanced Home Loan', labelHi: 'उन्नत ऋण' },
    { id: 'creditcard', labelEn: 'Credit Card EMI', labelHi: 'क्रेडिट कार्ड' },
  ];

  return (
    <nav className="sticky top-0 z-50 h-16 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm dark:border-slate-800/50 dark:bg-slate-950/70 transition-all duration-300">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo block */}
        <div 
          onClick={() => onTabChange('calculator')}
          className="flex cursor-pointer items-center gap-2 group shrink-0"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-950 transition-transform group-hover:scale-105 duration-200">
            <Calculator className="h-5 w-5 text-indigo-500 dark:text-indigo-600" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {currentLang === 'en' ? 'EMI' : 'ईएमआई'}{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {currentLang === 'en' ? 'Calculator' : 'कैलकुलेटर'}
            </span>
          </span>
        </div>

        {/* Center Nav items (Desktop / large screens) */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-6" id="desktop-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-link px-2.5 py-1 text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === item.id
                  ? 'text-indigo-650 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {currentLang === 'en' ? item.labelEn : item.labelHi}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />
          <button
            onClick={() => onOpenLegalModal('privacy')}
            className="text-xs font-bold text-slate-500 hover:text-indigo-655 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
          >
            {currentLang === 'en' ? 'Privacy' : 'गोपनीयता'}
          </button>
          <button
            onClick={() => onOpenLegalModal('contact')}
            className="text-xs font-bold text-slate-500 hover:text-indigo-655 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
          >
            {currentLang === 'en' ? 'Contact' : 'संपर्क'}
          </button>
        </div>

        {/* Right Nav Options (Desktop / large screens) */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0" id="desktop-right-options">
          {/* Language selector */}
          <div className="relative flex items-center gap-1.5 rounded-xl border border-slate-200/80 px-2.5 py-1.5 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/80">
            <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <select
              value={currentLang}
              onChange={(e) => onLangChange(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none dark:text-slate-350 cursor-pointer"
            >
              <option value="en" className="dark:bg-slate-900">EN (English)</option>
              <option value="hi" className="dark:bg-slate-900">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Theme switcher */}
          <button
            onClick={onToggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 transition-transform duration-500 hover:rotate-90" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-indigo-500 transition-transform duration-500 hover:-rotate-12" />
            )}
          </button>
        </div>

        {/* Mobile controls (Shown on tablet and mobile) */}
        <div className="flex items-center gap-2.5 lg:hidden" id="mobile-control-row">
          {/* Mobile Theme switcher */}
          <button
            onClick={onToggleDarkMode}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-600 dark:border-slate-800/80 dark:text-slate-400 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500" />
            )}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-700 dark:border-slate-800/80 dark:text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer (Shown on tablet and mobile) */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md p-4 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/95 animate-in fade-in slide-in-from-top-4 duration-200 lg:hidden z-40">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2 text-left text-sm font-semibold transition-colors ${
                  activeTab === item.id
                    ? 'text-indigo-650 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {currentLang === 'en' ? item.labelEn : item.labelHi}
              </button>
            ))}

            <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1" />

            {/* Mobile Privacy Policy link */}
            <button
              onClick={() => {
                onOpenLegalModal('privacy');
                setMobileMenuOpen(false);
              }}
              className="w-full py-1.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
            >
              🔐 {currentLang === 'en' ? 'Privacy Policy & Cookies' : 'गोपनीयता नीति (कुकीज़)'}
            </button>

            {/* Mobile Contact link */}
            <button
              onClick={() => {
                onOpenLegalModal('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full py-1.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors"
            >
              ✉️ {currentLang === 'en' ? 'Contact & Feedback Form' : 'प्रतिक्रिया एवं संपर्क करें'}
            </button>

            <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1" />

            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {currentLang === 'en' ? 'Select Language' : 'भाषा चुनें'}
              </span>
              <div className="flex items-center gap-1.5 rounded bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={currentLang}
                  onChange={(e) => {
                    onLangChange(e.target.value as Language);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-350 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
