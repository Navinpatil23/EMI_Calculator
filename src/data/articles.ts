export interface Article {
  id: string;
  categoryEn: string;
  categoryHi: string;
  readTime: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  paragraphsEn: string[];
  paragraphsHi: string[];
}

export const articles: Article[] = [
  {
    id: 'mclr-vs-repo',
    categoryEn: 'Banking policy',
    categoryHi: 'बैंकिंग नीति',
    readTime: '5 min read',
    titleEn: 'MCLR vs. Repo Rate (RLLR) Loan Benchmarks Explained',
    titleHi: 'MCLR बनाम रेपो रेट (RLLR) ऋण बेंचमार्क का विवरण',
    descriptionEn: 'Learn the difference between internal MCLR and external RLLR pricing models, and how to convert your home loan to save on interest.',
    descriptionHi: 'आंतरिक MCLR और बाहरी RLLR ब्याज दरों के मुख्य अंतर को जानें, और कम ब्याज के लिए अपने पुराने होम लोन को कैसे बदलें, इसकी जानकारी प्राप्त करें।',
    paragraphsEn: [
      "When you apply for a floating-rate home loan or retail loan in India, the interest rate you are offered is tied to a specific benchmark set by the bank. Historically, Indian banks have used internal benchmarks to price loans, which often resulted in slow interest rate transmission. In October 2019, the Reserve Bank of India (RBI) introduced a major reform by mandating that all new floating-rate retail loans be linked to an external benchmark, primarily the RBI Policy Repo Rate. This led to the dual systems we see today: the Marginal Cost of Funds Based Lending Rate (MCLR) and the Repo Linked Lending Rate (RLLR).",
      "MCLR is an internal benchmark calculation. It is computed based on the bank's own internal cost of borrowing funds, operating costs, and tenor premiums. Because it depends on the bank's internal cost parameters, it resets only once every 6 to 12 months. When the RBI cuts its repo rate, banks do not immediately lower their MCLR, meaning existing borrowers do not see benefits for months. Conversely, when rates rise, banks also delay the hikes, but generally, transmission is slower in cuts than in increases.",
      "RLLR (or EBLR - External Benchmark Lending Rate) is directly linked to the Reserve Bank of India's policy repo rate. The bank charges the repo rate plus a fixed operating margin (spread). When the RBI's Monetary Policy Committee changes the repo rate, the RLLR changes automatically within 3 months (quarterly reset). This offers complete transparency: if the repo rate drops by 0.25%, your loan interest drops by exactly 0.25% in the next reset cycle.",
      "Should you convert your old loan from MCLR to RLLR? In almost all cases, yes. RLLR-linked loans have historically shown faster rate transmission and generally carry a lower interest spread. Most banks allow you to switch your loan benchmark by paying a nominal administrative processing fee (ranging from ₹1,000 to ₹5,000). Before switching, compare the new RLLR offer with your current MCLR rate to ensure the spread reduction yields substantial savings over the remaining tenure."
    ],
    paragraphsHi: [
      "जब आप भारत में फ्लोटिंग-रेट होम लोन या खुदरा ऋण के लिए आवेदन करते हैं, तो आपको दी जाने वाली ब्याज दर बैंक द्वारा निर्धारित एक विशिष्ट बेंचमार्क से जुड़ी होती है। ऐतिहासिक रूप से, भारतीय बैंकों ने ऋण की कीमतें तय करने के लिए आंतरिक बेंचमार्क का उपयोग किया है, जिसके परिणामस्वरूप ब्याज दरों में बदलाव बहुत धीमी गति से लागू होता था। अक्टूबर 2019 में, भारतीय रिजर्व बैंक (RBI) ने सभी नए फ्लोटिंग-रेट खुदरा ऋणों को बाहरी बेंचमार्क, मुख्य रूप से RBI नीति रेपो दर से जोड़ना अनिवार्य करके एक बड़ा सुधार पेश किया। इससे आज दो प्रणालियाँ देखने को मिलती हैं: मार्जिनल कॉस्ट ऑफ फंड्स बेस्ड लेंडिंग रेट (MCLR) और रेपो लिंक्ड लेंडिंग रेट (RLLR)।",
      "MCLR एक आंतरिक बेंचमार्क गणना है। इसकी गणना बैंक की अपनी उधार लेने की लागत, परिचालन व्यय और अवधि प्रीमियम के आधार पर की जाती है। चूंकि यह बैंक के अपने खर्चों पर निर्भर करता है, इसलिए यह केवल 6 से 12 महीने में एक बार रीसेट होता है। जब आरबीआई अपनी रेपो दर में कटौती करता है, तो बैंक तुरंत अपना एमसीएलआर नहीं घटाते हैं, जिससे मौजूदा उधारकर्ताओं को महीनों तक लाभ नहीं मिलता है।",
      "RLLR (या EBLR - बाहरी बेंचमार्क लेंडिंग रेट) सीधे भारतीय रिजर्व बैंक की नीतिगत रेपो दर से जुड़ा हुआ है। बैंक रेपो दर के साथ एक निश्चित परिचालन मार्जिन (स्प्रेड) जोड़कर ब्याज लेता है। जब भी आरबीआई की मौद्रिक नीति समिति रेपो दर में बदलाव करती है, तो आरएलएलआर 3 महीने के भीतर स्वतः बदल जाता है। यह पूर्ण पारदर्शिता प्रदान करता है: यदि रेपो दर में 0.25% की गिरावट आती है, तो अगली रीसेट चक्र में आपकी ब्याज दर भी ठीक 0.25% कम हो जाएगी।",
      "क्या आपको अपने पुराने ऋण को MCLR से RLLR में बदलना चाहिए? लगभग सभी मामलों में, हाँ। RLLR से जुड़े ऋणों में तेजी से ब्याज दर कटौती का लाभ मिलता है और सामान्य तौर पर ब्याज दर कम होती है। अधिकांश बैंक आपको एक मामूली प्रशासनिक प्रसंस्करण शुल्क (₹1,000 से ₹5,000 तक) देकर अपना बेंचमार्क बदलने की अनुमति देते हैं। बदलने से पहले, अपने वर्तमान एमसीएलआर दर के साथ नए आरएलएलआर ऑफर की तुलना करें।"
    ]
  },
  {
    id: 'prepayment-hacks',
    categoryEn: 'Loan savings',
    categoryHi: 'ऋण बचत',
    readTime: '6 min read',
    titleEn: 'Prepayment Strategies: How to Pay Off Your Home Loan Faster',
    titleHi: 'ऋण पूर्व-भुगतान रणनीतियाँ: अपने होम लोन को तेजी से कैसे चुकाएं',
    descriptionEn: 'Discover powerful prepayment techniques like the 1 extra EMI rule and 5% yearly top-up to cut your loan tenure by years.',
    descriptionHi: 'ब्याज बचाने और अपने लोन की अवधि को सालों कम करने के लिए हर साल 1 अतिरिक्त ईएमआई और 5% वार्षिक टॉप-अप जैसी शक्तिशाली रणनीतियों के बारे में जानें।',
    paragraphsEn: [
      "A home loan is a long-term commitment, often stretching over 20 to 30 years. Because of the reducing balance interest calculation method, a massive portion of your EMI during the initial years goes strictly toward paying off the interest component rather than reducing the actual principal borrowed. For instance, on a ₹50 Lakh loan at 8.5% interest for 20 years, you will end up paying over ₹50 Lakhs in interest alone—effectively buying the home twice! Prepayments are the single most effective way to break this loop.",
      "Prepayment refers to making lump-sum or extra monthly payments toward your loan principal over and above your scheduled EMIs. Because every rupee prepaid goes directly toward reducing the outstanding principal, it triggers a compound interest-saving loop. A smaller principal outstanding means less interest is accrued in subsequent months, allowing your regular EMIs to clear more principal faster.",
      "The 'One Extra EMI' rule is a simple yet powerful strategy. By paying just one additional EMI amount every year (for example, by utilizing your yearly bonus or tax returns), you can reduce a typical 20-year home loan duration down to approximately 16.5 years. This simple discipline saves you lakhs in interest and closes your debt much earlier.",
      "The '5% Yearly Top-up' pattern is another excellent approach. As your salary or business revenue increases each year, you commit to increasing your monthly EMI contribution by just 5% of the initial EMI value. For a ₹40,000 monthly EMI, this means adding just ₹2,000 more in the second year, ₹4,100 in the third, and so on. This dynamic top-up reduces a 20-year loan to nearly 12 years and saves up to 45% of your total interest liabilities.",
      "Under Reserve Bank of India (RBI) guidelines, banks and financial institutions are strictly prohibited from charging any prepayment fees or penalties on floating-rate home loans, personal loans, or retail loans. When making a prepayment, always request the bank to apply the amount to 'Tenure Reduction' rather than 'EMI Reduction' to maximize your interest savings."
    ],
    paragraphsHi: [
      "होम लोन एक दीर्घकालिक प्रतिबद्धता है, जो अक्सर 20 से 30 वर्षों तक चलती है। घटते शेष ब्याज गणना पद्धति के कारण, आपके शुरुआती वर्षों के दौरान आपकी ईएमआई का एक बड़ा हिस्सा मूलधन को कम करने के बजाय केवल ब्याज चुकाने में चला जाता है। उदाहरण के लिए, 20 वर्षों के लिए 8.5% ब्याज पर ₹50 लाख के ऋण पर, आप केवल ब्याज में ₹50 लाख से अधिक का भुगतान करेंगे - यानी घर की मूल कीमत से दोगुना भुगतान! प्रीपेमेंट इस चक्र को तोड़ने का सबसे प्रभावी तरीका है।",
      "पूर्व-भुगतान (Prepayment) का अर्थ है आपकी निर्धारित ईएमआई के अतिरिक्त समय-समय पर ऋण मूलधन में एकमुश्त या अतिरिक्त मासिक भुगतान करना। क्योंकि पूर्व-भुगतान किया गया प्रत्येक रुपया सीधे बकाया मूलधन को कम करने में जाता है, यह चक्रवृद्धि ब्याज-बचत चक्र शुरू करता है। बकाया मूलधन कम होने का मतलब है कि आने वाले महीनों में कम ब्याज लगेगा, जिससे आपकी नियमित ईएमआई मूलधन को तेजी से चुका पाएगी।",
      "हर साल '1 अतिरिक्त ईएमआई' देने का नियम एक सरल लेकिन बेहद प्रभावी रणनीति है। हर साल केवल एक अतिरिक्त ईएमआई राशि का भुगतान करके (उदाहरण के लिए, अपने वार्षिक बोनस का उपयोग करके), आप 20 साल के होम लोन की अवधि को लगभग 16.5 साल तक कम कर सकते हैं। यह साधारण अनुशासन आपको लाखों की ब्याज बचत कराता है।",
      "वार्षिक '5% टॉप-अप' रणनीति एक और बेहतरीन दृष्टिकोण है। जैसे-जैसे आपकी आय हर साल बढ़ती है, आप अपनी मासिक ईएमआई योगदान में पिछले वर्ष की तुलना में केवल 5% की वृद्धि करने का संकल्प लेते हैं। यह गतिशील टॉप-अप 20 साल के ऋण को लगभग 12 साल में समाप्त कर देता है और कुल ब्याज देनदारियों को 45% तक बचा लेता है।",
      "भारतीय रिजर्व बैंक (RBI) के दिशानिर्देशों के तहत, बैंकों द्वारा फ्लोटिंग-रेट होम लोन, पर्सनल लोन या खुदरा ऋणों पर किसी भी प्रकार का प्रीपेमेंट शुल्क या जुर्माना लगाना सख्त वर्जित है।"
    ]
  },
  {
    id: 'foir-details',
    categoryEn: 'Credit score',
    categoryHi: 'क्रेडिट स्कोर',
    readTime: '4 min read',
    titleEn: 'Understanding FOIR (Fixed Obligations to Income Ratio)',
    titleHi: 'FOIR (फिक्स्ड ऑब्लिगेशन्स टू इनकम रेशियो) को समझें',
    descriptionEn: 'Know how banks calculate your loan eligibility based on your monthly fixed liabilities and how to optimize it for quick approvals.',
    descriptionHi: 'जानें कि बैंक आपकी मासिक ऋण देनदारियों के आधार पर आपकी लोन पात्रता की गणना कैसे करते हैं और त्वरित स्वीकृति के लिए इसे कैसे अनुकूलित करें।',
    paragraphsEn: [
      "When evaluating a loan application, banks do not just check your income or your credit score. They look closely at your cash flow capacity to ensure you can afford the new monthly EMIs. The primary financial metric used for this assessment is the **Fixed Obligations to Income Ratio (FOIR)**. FOIR measures the percentage of your net monthly income that goes toward paying off existing fixed liabilities.",
      "The mathematical formula to calculate FOIR is straightforward: sum up all your monthly fixed obligations (such as existing car loan EMIs, personal loan EMIs, credit card minimum balances, and rent) and divide it by your net monthly income, then multiply by 100. For instance, if your net monthly income is ₹1,00,000 and your total existing monthly EMIs sum up to ₹30,000, your FOIR is 30%.",
      "Most Indian banks prefer a FOIR of **40% to 50%** as the maximum lending limit. If a proposed home loan EMI pushes your total FOIR to 60% or 70%, the bank is highly likely to reject the application. This is because banks want to ensure you retain at least 50% of your earnings for daily living expenses, medical emergencies, taxes, and household maintenance.",
      "To optimize your FOIR before applying for a major loan, take two key steps: first, close any active high-interest short-term loans (like small personal loans, gadget EMIs, or credit card outstanding balances) to reduce your monthly fixed obligations. Second, consider applying jointly with a co-applicant (such as a spouse or working parent). The bank will add their income to yours, increasing the total monthly income denominator and automatically lowering the combined FOIR, allowing you to qualify for a larger loan amount."
    ],
    paragraphsHi: [
      "लोन आवेदन का मूल्यांकन करते समय, बैंक केवल आपकी आय या आपके सिबिल (CIBIL) स्कोर की जांच नहीं करते हैं। वे आपकी मासिक ऋण चुकाने की क्षमता का विश्लेषण करते हैं। इस मूल्यांकन के लिए उपयोग किया जाने वाला मुख्य वित्तीय पैमाना **फिक्स्ड ऑब्लिगेशन्स टू इनकम रेशियो (FOIR)** है। FOIR आपकी कुल मासिक आय के उस प्रतिशत को मापता है जो आपकी मौजूदा ऋण देनदारियों को चुकाने में चला जाता है।",
      "FOIR की गणना करने का सूत्र सीधा है: अपनी सभी मासिक निश्चित देनदारियों (जैसे कार लोन ईएमआई, पर्सनल लोन ईएमआई, क्रेडिट कार्ड न्यूनतम देय राशि, और किराया) को जोड़ें और इसे अपनी शुद्ध मासिक आय से विभाजित करें, फिर 100 से गुणा करें। उदाहरण के लिए, यदि आपकी मासिक आय ₹1,00,000 है और आपका कुल लोन भुगतान ₹30,000 है, तो आपका FOIR 30% है।",
      "अधिकांश भारतीय बैंक अधिकतम ऋण सीमा के रूप में **40% से 50%** का FOIR पसंद करते हैं। यदि नया होम लोन लेने के बाद आपका कुल FOIR 60% या 70% तक पहुंच जाता है, तो बैंक आपके आवेदन को अस्वीकार कर सकता है। ऐसा इसलिए है क्योंकि बैंक यह सुनिश्चित करना चाहते हैं कि आपके पास घरेलू खर्चों और आपात स्थितियों के लिए कम से कम 50% आय बची रहे।",
      "बड़ा ऋण लेने से पहले अपने FOIR को अनुकूलित करने के लिए: पहला, अपने छोटे लोन या क्रेडिट कार्ड ऋणों को बंद कर दें। दूसरा, सह-आवेदक (जैसे कामकाजी जीवनसाथी) के साथ संयुक्त आवेदन करें, जिससे संयुक्त आय बढ़ जाएगी और पात्रता में सुधार होगा।"
    ]
  },
  {
    id: 'advance-vs-arrears',
    categoryEn: 'Loan structure',
    categoryHi: 'ऋण संरचना',
    readTime: '4 min read',
    titleEn: 'EMI in Advance vs. EMI in Arrears: Which is Cheaper?',
    titleHi: 'अग्रिम ईएमआई (Advance) बनाम बकाया ईएमआई (Arrears) का गणित',
    descriptionEn: 'Discover the mathematical difference between advance and arrears EMI payment schemes, commonly offered in vehicle and commercial financing.',
    descriptionHi: 'वाहन ऋण और व्यावसायिक वित्तपोषण में दी जाने वाली अग्रिम (Advance) और बकाया (Arrears) ईएमआई भुगतान योजनाओं के गणितीय अंतर को समझें।',
    paragraphsEn: [
      "When purchasing a car or securing asset financing in India, dealers and banks often present two repayment structures: **EMI in Arrears** and **EMI in Advance**. While they sound similar, they represent entirely different payment schedules and affect the total interest cost of your loan.",
      "An 'EMI in Arrears' scheme is the standard repayment format. Here, interest accumulates over the first calendar month, and your first EMI is paid at the end of the month. For instance, if your loan is disbursed on January 1, your first EMI payment is due on January 31. Under this scheme, you enjoy the full usage of the loan capital for the month before starting repayments.",
      "In an 'EMI in Advance' scheme (often called the Annuity scheme), the first month's EMI is paid upfront at the time of loan disbursement. If your loan is disbursed on January 1, the first EMI is deducted immediately from the disbursed check. This means that from day one, your active outstanding loan principal is reduced by the principal component of one EMI, resulting in slightly lower interest accumulation over the tenure.",
      "Which is cheaper? Mathematically, **EMI in Advance is cheaper** because you start with a reduced principal balance, which translates to lower total interest outgo. However, it requires higher upfront liquidity because you must pay the first EMI on the day of delivery. If you need maximum immediate cash flow at disbursement, choose **EMI in Arrears**."
    ],
    paragraphsHi: [
      "भारत में कार खरीदते समय या संपत्ति वित्तपोषण प्राप्त करते समय, डीलर और बैंक अक्सर दो पुनर्भुगतान संरचनाएं प्रस्तुत करते हैं: **बकाया ईएमआई (EMI in Arrears)** और **अग्रिम ईएमआई (EMI in Advance)**। हालांकि वे सुनने में एक जैसे लगते हैं, लेकिन उनके भुगतान का समय अलग होता है और यह आपके ऋण की कुल ब्याज लागत को प्रभावित करता है।",
      "बकाया ईएमआई (Arrears) योजना मानक पुनर्भुगतान प्रारूप है। इसमें, पहले महीने के दौरान ब्याज जमा होता है और आपकी पहली ईएमआई का भुगतान महीने के अंत में किया जाता है। उदाहरण के लिए, यदि आपका ऋण 1 जनवरी को वितरित किया गया है, तो आपका पहला ईएमआई भुगतान 31 जनवरी को देय होगा।",
      "अग्रिम ईएमआई (Advance) योजना में, पहले महीने की ईएमआई का भुगतान ऋण वितरण के समय ही अग्रिम रूप से कर दिया जाता है। यदि आपका ऋण 1 जनवरी को वितरित किया जाता है, तो पहली ईएमआई तुरंत आपके ऋण चेक से काट ली जाती है। इसका मतलब है कि पहले दिन से ही आपका बकाया मूलधन कम हो जाता है, जिससे कुल ब्याज कम बनता है।",
      "कौन सा विकल्प सस्ता है? गणितीय रूप से, **अग्रिम ईएमआई सस्ता है** क्योंकि आप कम मूलधन के साथ शुरुआत करते हैं, जिससे कुल ब्याज खर्च कम हो जाता है। हालांकि, इसके लिए ऋण के पहले दिन ही नकद राशि की आवश्यकता होती है।"
    ]
  },
  {
    id: 'sbi-vs-hdfc-loans',
    categoryEn: 'Bank comparison',
    categoryHi: 'बैंक तुलना',
    readTime: '6 min read',
    titleEn: 'SBI vs. HDFC Home Loan Comparison Guide',
    titleHi: 'SBI बनाम HDFC होम लोन तुलना गाइड',
    descriptionEn: 'A detailed comparison between Indias largest public lender (SBI) and private lender (HDFC) on parameters like interest spreads, processing fees, and processing speeds.',
    descriptionHi: 'ब्याज दरों, प्रोसेसिंग शुल्क और लोन मिलने की गति जैसे महत्वपूर्ण मानकों पर भारत के सबसे बड़े सार्वजनिक ऋणदाता (SBI) और निजी ऋणदाता (HDFC) की विस्तृत तुलना।',
    paragraphsEn: [
      "Choosing the right home loan lender is as important as choosing the right property. In India, the comparison often boils down to the country's largest public sector lender, State Bank of India (SBI), and the leading private sector lender, HDFC Bank. Both offer highly competitive home loan products, but their processing methodologies, interest spreads, and client experiences differ significantly.",
      "SBI Home Loans are highly popular due to their transparency and minimal hidden charges. SBI's floating rates are linked to the external benchmark lending rate (EBLR), which directly tracks the RBI Repo rate. SBI generally offers some of the lowest interest spreads in the industry, and they regularly run campaigns waiving processing fees entirely. However, because SBI is a public sector bank, the document verification process is extremely rigorous and requires substantial paperwork, which can delay disbursement by 2 to 3 weeks.",
      "HDFC Bank Home Loans are preferred by borrowers who prioritize speed, digital convenience, and quick turnarounds. HDFC's processing is streamlined and requires less physical branch visits. Loans are often approved within a few working days. However, HDFC's interest spreads can be slightly higher than SBI's, and their administrative processing fees are rarely waived completely, typically ranging from 0.25% to 0.50% of the loan amount.",
      "When choosing, consider your priorities: if you seek the absolute lowest interest cost and have time to navigate detailed paperwork, **SBI** is the best choice. If you are under a tight deadline to complete your home registration and value speed and digital processing, **HDFC Bank** offers the ideal solution."
    ],
    paragraphsHi: [
      "सही प्रॉपर्टी चुनने के साथ-साथ सही होम लोन बैंक चुनना भी बहुत महत्वपूर्ण है। भारत में, अक्सर तुलना देश के सबसे बड़े सार्वजनिक क्षेत्र के बैंक, भारतीय स्टेट बैंक (SBI) और प्रमुख निजी क्षेत्र के बैंक, HDFC बैंक के बीच होती है। दोनों बैंक प्रतिस्पर्धी उत्पादों की पेशकश करते हैं, लेकिन उनके ऋण स्वीकृत करने की प्रक्रिया में काफी अंतर होता है।",
      "SBI होम लोन अपनी पारदर्शिता और न्यूनतम छिपे हुए शुल्कों के लिए जाना जाता है। एसबीआई की दरें रेपो रेट से जुड़ी हैं, जिससे ब्याज दरें बेहद पारदर्शी रहती हैं। एसबीआई में प्रोसेसिंग फीस छूट के कई ऑफर आते हैं, लेकिन सरकारी बैंक होने के कारण दस्तावेज़ सत्यापन प्रक्रिया में अधिक समय (2 से 3 सप्ताह) लग सकता है।",
      "HDFC बैंक होम लोन उन लोगों द्वारा पसंद किया जाता है जो त्वरित स्वीकृति और डिजिटल सुविधा चाहते हैं। एचडीएफसी में लोन कुछ ही दिनों में स्वीकृत हो जाता है, लेकिन उनके ब्याज स्प्रेड और प्रोसेसिंग शुल्क एसबीआई की तुलना में थोड़े अधिक हो सकते हैं।",
      "चयन करते समय: यदि आप न्यूनतम ब्याज दर चाहते हैं और दस्तावेज़ीकरण के लिए समय दे सकते हैं, तो **SBI** चुनें। यदि आपके पास समय की कमी है और आप डिजिटल प्रक्रिया चाहते हैं, तो **HDFC** सबसे अच्छा विकल्प है।"
    ]
  }
];
