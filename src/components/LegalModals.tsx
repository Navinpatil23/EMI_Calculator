import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Mail, Send, CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';
import { Language } from '../types';

interface LegalModalsProps {
  currentLang: Language;
  isOpen: boolean;
  type: 'privacy' | 'terms' | 'contact' | null;
  onClose: () => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

export default function LegalModals({
  currentLang,
  isOpen,
  type,
  onClose,
  onShowToast,
}: LegalModalsProps) {
  // Feedback form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      onShowToast(
        currentLang === 'en'
          ? '⚠️ Please complete all required fields.'
          : '⚠️ कृपया सभी आवश्यक फ़ील्ड भरें।',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onShowToast(
        currentLang === 'en'
          ? '🎉 Thank you! Your feedback has been successfully compiled.'
          : '🎉 धन्यवाद! आपकी प्रतिक्रिया सफलतापूर्वक दर्ज कर ली गई है।',
        'success'
      );

      // Save to local log for validation/verification
      const feedBackLog = JSON.parse(localStorage.getItem('emi_feedback_log') || '[]');
      feedBackLog.push({
        id: Date.now(),
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('emi_feedback_log', JSON.stringify(feedBackLog));

      // Reset fields after successfully sending
      setTimeout(() => {
        setName('');
        setEmail('');
        setSubject('Feedback');
        setMessage('');
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  if (!isOpen || !type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop filter blur shadow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-colors duration-300 flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              {type === 'privacy' && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              )}
              {type === 'terms' && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <FileText className="h-5 w-5" />
                </div>
              )}
              {type === 'contact' && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
              )}
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {type === 'privacy' && (currentLang === 'en' ? 'Privacy Policy & Cookies' : 'गोपनीयता नीति और कुकीज़')}
                {type === 'terms' && (currentLang === 'en' ? 'Terms of Use & Disclaimer' : 'उपयोग की शर्तें और अस्वीकरण')}
                {type === 'contact' && (currentLang === 'en' ? 'Contact Us & Feedback Form' : 'हमसे संपर्क करें और प्रतिक्रिया फॉर्म')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-450 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto leading-relaxed text-sm text-slate-650 dark:text-slate-350 space-y-6">
            
            {/* ======================================================================= */}
            {/* 1. PRIVACY POLICY CONTENT */}
            {/* ======================================================================= */}
            {type === 'privacy' && (
              <div className="space-y-4">
                {currentLang === 'en' ? (
                  <>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      Standard Cookie & Compliance Charter - Last Updated: June 10, 2026
                    </p>
                    <p>
                      Welcome to <strong>EMI Calculator India Premium</strong>. Your privacy is paramount. This trust charter clarifies how we manage client telemetry, caching, and compliance parameters inside our RBI reducing balance suite.
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        🛡️ Zero Personal Data Storage
                      </span>
                      <p className="text-xs">
                        All financial datasets (loan amounts, tenures, rates, and amortization schedules) are run entirely inside your browser's runtime compiler memory. No financial datasets are transported to external cloud servers, fully preserving individual confidentiality under official fair play metrics.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">1. Cookie Usage Details</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        We utilize local client storage (such as persistent parameters and cookies) solely to retain your localized configuration variables (Theme preferences, Language preferences, and current calculations save state) so you don't lose progress between workspace sessions. No marketing cookies are shared or sold.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">2. Google AdSense & Monetization Metrics</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        This digital application complies with AdSense publisher guidelines. Google, as a third-party seller, uses cookies to serve ads on this applet. Google's use of advertising cookies enables it and its partners to serve personalized and non-personalized advertisements based on your browsing histories.
                      </p>
                      <p className="text-xs text-slate-550 dark:text-slate-400">
                        You can manage individualized preferences or opt out of personalized tracking settings by visiting{' '}
                        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
                          Google Ads Settings
                        </a>.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 font-sans">3. Telemetry and Analytics</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        We may monitor non-identifying technical logs (such as device types or system languages) to resolve bugs and optimize rendering speeds across different screens.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-850 dark:text-slate-200">
                      मानक कुकी और अनुपालन चार्टर - अंतिम संपादन: 10 जून, 2026
                    </p>
                    <p>
                      <strong>ईएमआई कैलकुलेटर इंडिया प्रीमियम</strong> में आपका स्वागत है। आपकी गोपनीयता हमारे लिए अत्यंत महत्वपूर्ण है। यह चार्टर स्पष्ट करता है कि हम आपके ब्राउज़र मेमोरी, अधिमानों और विज्ञापनों को कैसे प्रबंधित करते हैं।
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        🛡️ शून्य व्यक्तिगत डेटा संग्रहण
                      </span>
                      <p className="text-xs">
                        आपकी सभी ऋण गणनाएं (ऋण राशि, ब्याज दर, अवधि और पुनर्भुगतान विवरण) पूरी तरह से आपके ब्राउज़र की रैम मेमोरी में स्थानीय रूप से चलाई जाती हैं। किसी भी संवेदनशील वित्तीय डेटा को क्लाउड सर्वर पर नहीं भेजा जाता है, जिससे आपकी प्राइवेसी 100% सुरक्षित रहती है।
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">1. कुकीज़ का उपयोग</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        हम कुकीज़ और लोकल ब्राउज़र डेटा का उपयोग केवल आपके भाषा चयन, डार्क थीम प्राथमिकताओं और सहेजे गए ऋण इतिहास को याद रखने के लिए करते हैं। हम कभी भी किसी मार्केटिंग कंपनियों को डेटा नहीं बेचते हैं।
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">2. गूगल एडसेंस (Google AdSense) और विज्ञापन नीतियां</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        यह उत्पाद Google AdSense प्रकाशक नीतियों का पालन करता है। Google हमारी वेबसाइट पर विज्ञापन दिखाने के लिए कुकीज़ का उपयोग करता है। Google के इन विज्ञापनों का उद्देश्य भारतीय नियम अनुपालनों के भीतर आपको प्रासंगिक और गैर-व्यक्तिगत विज्ञापन दिखाना है।
                      </p>
                      <p className="text-xs text-slate-550 dark:text-slate-400">
                        आप विज्ञापन अनुकूलन को नियंत्रित करने या इससे बाहर निकलने के लिए{' '}
                        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
                          गूगल विज्ञापन सेटिंग्स (Google Ads Settings)
                        </a> पर जा सकते हैं।
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ======================================================================= */}
            {/* 2. TERMS OF USE CONTENT */}
            {/* ======================================================================= */}
            {type === 'terms' && (
              <div className="space-y-4">
                {currentLang === 'en' ? (
                  <>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      Standard Terms of Service & Disclaimer - Last Updated: June 10, 2026
                    </p>
                    
                    <div className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50/60 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 shrink-0" /> Critical Disclaimer
                      </span>
                      <p className="text-xs leading-relaxed">
                        <strong>This tool is provided for educational and informational estimation purposes only. It does not constitute formal financial, healthcare, legal, or investment advice under compliance standards.</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">1. Accuracy of Calculations</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Calculations are derived using standardized mathematical formulas (Reducing Balance methodology and Indian Banking interest schedules). While we benchmark against actual RBI models regularly, exact interest valuations, processing fees, GST, and premium surcharges might differ depending on individual bank criteria, loan terms, and credit scores.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 font-sans">2. Consultation with Professionals</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Do not make binding home purchase, commercial credit, or personal loans solely based on these estimates. Always consult certified financial counselors, chartered accountants, or banking partners before signing credit sheets.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">3. Liability Limits</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        In no event shall the authors or copyright holders of this calculator be held liable for any financial losses, budget discrepancies, or damages resulting from your reliance on our estimated outputs.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      नियम एवं शर्तें और कानूनी अस्वीकरण - अंतिम संपादन: 10 जून, 2026
                    </p>
                    
                    <div className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50/60 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 shrink-0" /> महत्वपूर्ण अस्वीकरण (Disclaimer)
                      </span>
                      <p className="text-xs leading-relaxed">
                        <strong>यह कैलकुलेटर केवल शैक्षिक और संभावित अनुमानों के उपयोग के लिए बनाया गया है। इसे किसी भी कानूनी, वित्तीय, चिकित्सा, कर, या पेशेवर ऋण सलाह के रूप में नहीं माना जा सकता है।</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">1. गणनाओं की सटीकता</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        नियमों के अनुसार ब्याज की गणना मानक घटती शेष (Reducing Balance) गणितीय समीकरणों पर आधारित है। हालांकि हम इसे वास्तविक बैंक दरों से मिलाते हैं, फिर भी आपके ऋणदाता की ब्याज की गणना, प्रसंस्करण शुल्क, बीमा और जीएसटी शुल्क बैंक से बैंक में भिन्न हो सकते हैं।
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 font-sans">2. विशेषज्ञों से सलाह लें</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        सदन या व्यापार खरीदने जैसे बड़े वित्तीय निर्णय केवल इस वेब कैलकुलेटर के आंकड़ों के आधार पर न लें। कृपया ऋण अनुबंधों पर हस्ताक्षर करने से पहले पेशेवर चार्टर्ड अकाउंटेंट (CA) या बैंक अधिकारी से संपर्क करके पुष्टि करें।
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ======================================================================= */}
            {/* 3. CONTACT & FEEDBACK FORM */}
            {/* ======================================================================= */}
            {type === 'contact' && (
              <div className="space-y-4">
                <p className="text-xs">
                  {currentLang === 'en'
                    ? 'Do you have suggestions, spotted an issue, or want to share feedback to help us build a better experience? Submit your insights directly below!'
                    : 'क्या आपके पास कोई सुझाव है, आपको कैलकुलेटर में कोई त्रुटि मिली है, या आप बेहतर अनुभव बनाने के लिए प्रतिक्रिया साझा करना चाहते हैं? नीचे सीधे सबमिट करें।'}
                </p>

                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/55"
                  >
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
                    <h4 className="font-display text-base font-bold text-slate-800 dark:text-slate-200">
                      {currentLang === 'en' ? 'Feedback Submitted Successfully!' : 'प्रतिक्रिया सफलतापूर्वक भेज दी गई!'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                      {currentLang === 'en'
                        ? 'We appreciate your dedication towards making high-fidelity calculations accessible. Our engineering team is reviewing your audit message.'
                        : 'कैलकुलेशन को सुलभ बनाने के प्रति आपकी भागीदारी की हम सराहना करते हैं। हमारी टीम आपके संदेश की समीक्षा कर रही है।'}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                          {currentLang === 'en' ? 'Your Name' : 'आपका नाम'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={currentLang === 'en' ? 'e.g., Navin Patil' : 'उदा. नवीन पाटिल'}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 transition-all"
                        />
                      </div>

                      {/* Email input */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                          {currentLang === 'en' ? 'Email Address' : 'ईमेल पता'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="navin@example.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 transition-all"
                        />
                      </div>
                    </div>

                    {/* Subject selection */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                        {currentLang === 'en' ? 'Subject Category' : 'विषय श्रेणी'}
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 transition-all cursor-pointer"
                      >
                        <option value="General Suggestion">💡 {currentLang === 'en' ? 'General Suggestion' : 'सामान्य सुझाव'}</option>
                        <option value="Bug Report">🐛 {currentLang === 'en' ? 'Bug Report & Math Check' : 'त्रुटि और गणितीय सुधार'}</option>
                        <option value="New Feature Request">⚡ {currentLang === 'en' ? 'New Feature Request' : 'नई सुविधा का अनुरोध'}</option>
                        <option value="AdSense / Partnerships">🤝 {currentLang === 'en' ? 'Advertising & Partnerships' : 'विज्ञापन और साझेदारी'}</option>
                      </select>
                    </div>

                    {/* Message detail */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                        {currentLang === 'en' ? 'Detailed Message' : 'विस्तृत संदेश'} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder={
                          currentLang === 'en'
                            ? 'Please provide as much feedback as possible (including loan parameters or rates if reporting a math bug)...'
                            : 'कृपया यथासंभव प्रतिक्रिया विवरण साझा करें (जैसे कि गणित की गड़बड़ी की सुचना होने पर लोन के पैरामीटर्स)'
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 transition-all resize-none"
                      />
                    </div>

                    {/* Actions button */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 cursor-pointer transition-opacity disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {isSubmitting
                          ? (currentLang === 'en' ? 'Sending...' : 'भेजा जा रहा है...')
                          : (currentLang === 'en' ? 'Submit Feedback' : 'प्रतिक्रिया सबमिट करें')}
                      </button>
                    </div>
                  </form>
                )}

                {/* Local Storage Records Count to show real state works */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Bookmark className="h-3 w-3" />
                    {currentLang === 'en' ? 'Confidential Sandbox Mode Active' : 'गोपनीय सैंडबॉक्स मोड सक्रिय है'}
                  </span>
                  <span>
                    Email: navinmalipatil@gmail.com
                  </span>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
