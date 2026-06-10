import React, { useState } from 'react';
import { Calculator, Moon, Sun, Globe, Menu, X, ChevronDown, Landmark, PiggyBank, Percent, Sparkles, TrendingUp } from 'lucide-react';
import { Language, AppTab } from '../types';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab, subType?: string) => void;
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
  onOpenLegalModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLoansOpen, setMobileLoansOpen] = useState(false);
  const [mobileInvestmentsOpen, setMobileInvestmentsOpen] = useState(false);

  const [desktopLoansOpen, setDesktopLoansOpen] = useState(false);
  const [desktopInvestmentsOpen, setDesktopInvestmentsOpen] = useState(false);

  const t = {
    en: {
      loans: "Loans & EMIs",
      investments: "Investments",
      homeLoan: "Home Loan EMI",
      carLoan: "Car Loan (Advance/Arrears)",
      personalLoan: "Personal Loan EMI",
      compare: "Compare Loans",
      advanced: "Advanced Home Simulator",
      creditCard: "Credit Card EMI Converter",
      sip: "SIP Wealth Planner",
      lumpsum: "Lumpsum Returns Calculator",
      fd: "Fixed Deposit (FD) compound",
      rd: "Recurring Deposit (RD) monthly",
      privacy: "Privacy",
      contact: "Contact",
      language: "Select Language"
    },
    hi: {
      loans: "ऋण और ईएमआई (Loans)",
      investments: "निवेश टूल्स (Investments)",
      homeLoan: "होम लोन ईएमआई (Home Loan)",
      carLoan: "कार लोन (Car Loan)",
      personalLoan: "व्यक्तिगत लोन (Personal Loan)",
      compare: "ऋण तुलना (Compare Loans)",
      advanced: "उन्नत होम सिम्युलेटर (Advanced)",
      creditCard: "क्रेडिट कार्ड ईएमआई (Credit Card)",
      sip: "एसआईपी वेल्थ प्लानर (SIP)",
      lumpsum: "एकमुश्त रिटर्न (Lumpsum)",
      fd: "फिक्स्ड डिपॉजिट (FD)",
      rd: "रिकरिंग डिपॉजिट (RD)",
      privacy: "गोपनीयता",
      contact: "संपर्क",
      language: "भाषा चुनें"
    }
  }[currentLang];

  return (
    <nav className="sticky top-0 z-50 h-16 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm dark:border-slate-800/50 dark:bg-slate-950/70 transition-all duration-300">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo block */}
        <div 
          onClick={() => onTabChange('calculator', 'home')}
          className="flex cursor-pointer items-center gap-2 group shrink-0"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-950 transition-transform group-hover:scale-105 duration-200">
            <Calculator className="h-5 w-5 text-indigo-500 dark:text-indigo-600" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
            {currentLang === 'en' ? 'EMI' : 'ईएमआई'}{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {currentLang === 'en' ? 'Calculator' : 'कैलकुलेटर'}
            </span>
          </span>
        </div>

        {/* Center Nav Dropdowns (Desktop) */}
        <div className="hidden lg:flex items-center gap-6" id="desktop-nav-menu">
          
          {/* Loans Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setDesktopLoansOpen(true)}
            onMouseLeave={() => setDesktopLoansOpen(false)}
          >
            <button className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              activeTab === 'calculator' || activeTab === 'compare' || activeTab === 'advanced' || activeTab === 'creditcard'
                ? 'text-indigo-650 dark:text-indigo-455 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}>
              <span>{t.loans}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${desktopLoansOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {desktopLoansOpen && (
              <div className="absolute left-0 mt-0.5 w-64 rounded-2xl border border-slate-200/60 bg-white/95 p-3 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => { onTabChange('calculator', 'home'); setDesktopLoansOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  {t.homeLoan}
                </button>
                <button 
                  onClick={() => { onTabChange('calculator', 'car'); setDesktopLoansOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  {t.carLoan}
                </button>
                <button 
                  onClick={() => { onTabChange('calculator', 'personal'); setDesktopLoansOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  {t.personalLoan}
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5" />
                <button 
                  onClick={() => { onTabChange('compare'); setDesktopLoansOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  {t.compare}
                </button>
                <button 
                  onClick={() => { onTabChange('advanced'); setDesktopLoansOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <PiggyBank className="h-4 w-4 text-amber-500" />
                  {t.advanced}
                </button>
                <button 
                  onClick={() => { onTabChange('creditcard'); setDesktopLoansOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Percent className="h-4 w-4 text-red-500" />
                  {t.creditCard}
                </button>
              </div>
            )}
          </div>

          {/* Investments Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setDesktopInvestmentsOpen(true)}
            onMouseLeave={() => setDesktopInvestmentsOpen(false)}
          >
            <button className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              activeTab === 'investments'
                ? 'text-indigo-650 dark:text-indigo-455 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}>
              <span>{t.investments}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${desktopInvestmentsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {desktopInvestmentsOpen && (
              <div className="absolute left-0 mt-0.5 w-60 rounded-2xl border border-slate-200/60 bg-white/95 p-3 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => { onTabChange('investments', 'sip'); setDesktopInvestmentsOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  {t.sip}
                </button>
                <button 
                  onClick={() => { onTabChange('investments', 'lumpsum'); setDesktopInvestmentsOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  {t.lumpsum}
                </button>
                <button 
                  onClick={() => { onTabChange('investments', 'fd'); setDesktopInvestmentsOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Landmark className="h-4 w-4 text-emerald-500" />
                  {t.fd}
                </button>
                <button 
                  onClick={() => { onTabChange('investments', 'rd'); setDesktopInvestmentsOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Landmark className="h-4 w-4 text-emerald-500" />
                  {t.rd}
                </button>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />
          
          <button
            onClick={() => onOpenLegalModal('privacy')}
            className="text-xs font-bold text-slate-500 hover:text-indigo-655 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
          >
            {t.privacy}
          </button>
          
          <button
            onClick={() => onOpenLegalModal('contact')}
            className="text-xs font-bold text-slate-500 hover:text-indigo-655 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
          >
            {t.contact}
          </button>
        </div>

        {/* Right Options (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0" id="desktop-right-options">
          {/* Language selector */}
          <div className="relative flex items-center gap-1.5 rounded-xl border border-slate-200/80 px-2.5 py-1.5 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/80">
            <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <select
              value={currentLang}
              onChange={(e) => onLangChange(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none dark:text-slate-355 cursor-pointer"
            >
              <option value="en" className="dark:bg-slate-900">EN (English)</option>
              <option value="hi" className="dark:bg-slate-900">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 hover:rotate-90 duration-500 transition-transform" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-indigo-500 hover:-rotate-12 duration-500 transition-transform" />
            )}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2.5 lg:hidden" id="mobile-control-row">
          <button
            onClick={onToggleDarkMode}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-600 dark:border-slate-800/80 dark:text-slate-400 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-700 dark:border-slate-800/80 dark:text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md p-4 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/95 animate-in fade-in slide-in-from-top-4 duration-200 lg:hidden z-40 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            
            {/* Mobile Loans Accordion */}
            <div>
              <button 
                onClick={() => setMobileLoansOpen(!mobileLoansOpen)}
                className="w-full py-2.5 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800"
              >
                <span>{t.loans}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileLoansOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileLoansOpen && (
                <div className="pl-4 py-1.5 space-y-2.5 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl mt-1.5 p-2">
                  <button 
                    onClick={() => { onTabChange('calculator', 'home'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.homeLoan}
                  </button>
                  <button 
                    onClick={() => { onTabChange('calculator', 'car'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.carLoan}
                  </button>
                  <button 
                    onClick={() => { onTabChange('calculator', 'personal'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.personalLoan}
                  </button>
                  <button 
                    onClick={() => { onTabChange('compare'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.compare}
                  </button>
                  <button 
                    onClick={() => { onTabChange('advanced'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.advanced}
                  </button>
                  <button 
                    onClick={() => { onTabChange('creditcard'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.creditCard}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Investments Accordion */}
            <div>
              <button 
                onClick={() => setMobileInvestmentsOpen(!mobileInvestmentsOpen)}
                className="w-full py-2.5 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800"
              >
                <span>{t.investments}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileInvestmentsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileInvestmentsOpen && (
                <div className="pl-4 py-1.5 space-y-2.5 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl mt-1.5 p-2">
                  <button 
                    onClick={() => { onTabChange('investments', 'sip'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.sip}
                  </button>
                  <button 
                    onClick={() => { onTabChange('investments', 'lumpsum'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.lumpsum}
                  </button>
                  <button 
                    onClick={() => { onTabChange('investments', 'fd'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.fd}
                  </button>
                  <button 
                    onClick={() => { onTabChange('investments', 'rd'); setMobileMenuOpen(false); }}
                    className="w-full text-left py-1 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    • {t.rd}
                  </button>
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1" />

            <button
              onClick={() => { onOpenLegalModal('privacy'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-650"
            >
              🔐 {t.privacy}
            </button>
            <button
              onClick={() => { onOpenLegalModal('contact'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-655"
            >
              ✉️ {t.contact}
            </button>

            <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1.5" />

            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.language}</span>
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
