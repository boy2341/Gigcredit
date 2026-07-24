(() => {
  if (!GigCreditAPI.requireAuth('worker')) return;

  const $ = (id) => document.getElementById(id);
  const fmtRupee = GigCreditAPI.fmtRupee || ((n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`);

  const ALL_PLATFORMS = ['Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Uber India', 'Ola', 'Porter', 'Rapido', 'Urban Company', 'Shadowfax'];

  // Multilingual Vernacular Translation Dictionary
  const TRANSLATIONS = {
    en: {
      navBrand: 'GigCredit Worker Portal',
      greeting: 'Namaste,',
      runUnderwrite: 'Run 2-Min Credit Check',
      payoutSim: 'Simulate Payout & EMI',
      aaSync: 'Sync Finvu Bank Statement',
      smsParse: 'Parse App Earnings Alert',
      instantDraw: 'Draw ₹1,000 to UPI',
      viewReport: 'View Full Underwriting',
      expStep1Title: 'Link Work Accounts',
      expStep1Desc: 'Connect Swiggy, Zomato, Uber, Blinkit in 1-click.',
      expStep2Title: 'Build GigCredit Score',
      expStep2Desc: 'Based on income stability & work discipline (No CIBIL).',
      expStep3Title: 'Daily Micro-EMI Loans',
      expStep3Desc: 'Auto-deducted at Escrow (e.g. ₹100 / daily payout).',
      scoreTitle: 'GigCredit Score',
      tenureTitle: 'Account Continuity',
      velocityTitle: 'Multi-App Velocity',
      velocitySub: 'Stability > Volume (MoM Growth in ₹)',
      stabilityTitle: 'Stability Index',
      incomeTitle: 'Verified Income (₹)',
      incomeSub: 'AA Bank Statement & SMS Verified',
      trustTitle: 'Operational Trust',
      creditLineTitle: 'Pre-Approved Credit Line',
      creditLineSub: 'Escrow-backed Instant Liquidity',
      requestNBFC: 'Request RBI NBFC Bids',
      repTitle: 'Holistic Gig Credit Analysis',
      escrowTitle: 'Escrow Wallet (₹)',
      linkedAppsTitle: 'Linked Gig Work Accounts',
      linkedAppsSub: 'Consent-based API & SMS Ingestion across all major Indian platforms',
    },
    hi: {
      navBrand: 'गिगक्रेडिट वर्कर पोर्टल',
      greeting: 'नमस्ते,',
      runUnderwrite: '2-मिनट क्रेडिट जांच करें',
      payoutSim: 'पेआउट और ईएमआई जांचें',
      aaSync: 'बैंक खाता लिंक करें (AA)',
      smsParse: 'एसएमएस कमाई दर्ज करें',
      instantDraw: 'UPI में ₹1,000 निकालें',
      viewReport: 'क्रेडिट रिपोर्ट देखें',
      expStep1Title: 'काम के ऐप जोड़ें',
      expStep1Desc: 'Swiggy, Zomato, Uber, Blinkit 1-क्लिक में जोड़ें।',
      expStep2Title: 'गिगक्रेडिट स्कोर बनाएं',
      expStep2Desc: 'आपकी कमाई की स्थिरता के आधार पर (बिना सिबिल स्कोर के)।',
      expStep3Title: 'दैनिक माइक्रो-ईएमआई',
      expStep3Desc: 'रोजाना पेआउट से अपने आप कटेगी (जैसे ₹100/दिन)।',
      scoreTitle: 'गिगक्रेडिट स्कोर',
      tenureTitle: 'काम की निरंतरता',
      velocityTitle: 'मल्टी-ऐप कमाई गति',
      velocitySub: 'स्थिरता > मात्रा (प्रति माह वृद्धि ₹)',
      stabilityTitle: 'स्थिरता सूचकांक',
      incomeTitle: 'सत्यापित आय (₹)',
      incomeSub: 'बैंक खाता और एसएमएस द्वारा सत्यापित',
      trustTitle: 'ऑपरेशनल भरोसा',
      creditLineTitle: 'स्वीकृत लोन सीमा (₹)',
      creditLineSub: 'तुरंत UPI ट्रांसफर हेतु उपलब्ध',
      requestNBFC: 'RBI NBFC ऑफर देखें',
      repTitle: 'संपूर्ण क्रेडिट और पात्रता विश्लेषण',
      escrowTitle: 'एस्क्रौ वॉलेट (₹)',
      linkedAppsTitle: 'जुड़े हुए गिग वर्क ऐप्स',
      linkedAppsSub: 'सभी प्रमुख भारतीय ऐप्स से सुरक्षित ऑटो-सिंक',
    },
    kn: {
      navBrand: 'ಗಿಗ್ಕ್ರೆಡಿಟ್ ವರ್ಕರ್ ಪೋರ್ಟಲ್',
      greeting: 'ನಮಸ್ಕಾರ,',
      runUnderwrite: '2-ನಿಮಿಷದ ಕ್ರೆಡಿಟ್ ಪರೀಕ್ಷೆ',
      payoutSim: 'ಪಾವತಿ ಮತ್ತು EMI ಮಾದರಿ',
      aaSync: 'ಬ್ಯಾಂಕ್ ಖಾತೆ ಲಿಂಕ್ ಮಾಡಿ (AA)',
      smsParse: 'SMS ಪಾವತಿ ಪರಿಶೀಲಿಸಿ',
      instantDraw: 'UPI ಗೆ ₹1,000 ಪಡೆಯಿರಿ',
      viewReport: 'ಪೂರ್ಣ ವರದಿ ವೀಕ್ಷಿಸಿ',
      expStep1Title: 'ಕೆಲಸದ ಆ್ಯಪ್‌ಗಳನ್ನು ಲಿಂಕ್ ಮಾಡಿ',
      expStep1Desc: 'Swiggy, Zomato, Uber, Blinkit 1-ಕ್ಲಿಕ್‌ನಲ್ಲಿ.',
      expStep2Title: 'ಗಿಗ್‌ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ಬೆಳೆಸಿ',
      expStep2Desc: 'ಆದಾಯದ ಸ್ಥಿರತೆ ಮತ್ತು ಶಿಸ್ತಿನ ಆಧಾರದ ಮೇಲೆ (CIBIL ಬೇಕಿಲ್ಲ).',
      expStep3Title: 'ದೈನಂದಿನ ಮೈಕ್ರೋ-EMI',
      expStep3Desc: 'ದೈನಂದಿನ ಪಾವತಿಯಿಂದ ಸ್ವಯಂಚಾಲಿತ ಕಡಿತ (ಉದಾ. ₹100/ದಿನ).',
      scoreTitle: 'ಗಿಗ್‌ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್',
      tenureTitle: 'ಖಾತೆಯ ಸಮಯ',
      velocityTitle: 'ಮಲ್ಟಿ-ಆ್ಯಪ್ ವೇಗ',
      velocitySub: 'ಸ್ಥಿರತೆ > ಪ್ರಮಾಣ (ಮಾಸಿಕ ಬೆಳವಣಿಗೆ ₹)',
      stabilityTitle: 'ಸ್ಥಿರತೆ ಸೂಚ್ಯಂಕ',
      incomeTitle: 'ದೃಢೀಕರಿಸಿದ ಆದಾಯ (₹)',
      incomeSub: 'AA ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್ ಮತ್ತು SMS ಮೂಲಕ',
      trustTitle: 'ಕಾರ್ಯಾಚರಣೆಯ ನಂಬಿಕೆ',
      creditLineTitle: 'ಪೂರ್ವ-ಅನುಮೋದಿತ ಸಾಲದ ಮಿತಿ',
      creditLineSub: 'ತಕ್ಷಣದ ನಗದು ಲಭ್ಯತೆ',
      requestNBFC: 'RBI NBFC ಆಫರ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ',
      repTitle: 'ಪೂರ್ಣ ಕ್ರೆಡಿಟ್ ವಿಶ್ಲೇಷಣೆ',
      escrowTitle: 'ಎಸ್ಕ್ರೋ ವಾಲೆಟ್ (₹)',
      linkedAppsTitle: 'ಸಂಪರ್ಕಿತ ಕೆಲಸದ ಆ್ಯಪ್‌ಗಳು',
      linkedAppsSub: 'ಭಾರತದ ಪ್ರಮುಖ ಆ್ಯಪ್‌ಗಳಿಂದ ಸುರಕ್ಷಿತ ಡೇಟಾ',
    },
    te: {
      navBrand: 'గిగ్‌క్రెడిట్ వర్కర్ పోర్టల్',
      greeting: 'నమస్కారం,',
      runUnderwrite: '2-నిమిషాల క్రెడిట్ చెక్',
      payoutSim: 'పేఅవుట్ & EMI సిమ్యులేషన్',
      aaSync: 'బ్యాంక్ ఖాతా లింక్ చేయండి (AA)',
      smsParse: 'SMS పేఅవుట్ తనిఖీ',
      instantDraw: 'UPI కి ₹1,000 పొందండి',
      viewReport: 'క్రెడిట్ నివేదిక చూడండి',
      expStep1Title: 'పని యాప్‌లను లింక్ చేయండి',
      expStep1Desc: 'Swiggy, Zomato, Uber, Blinkit 1-క్లిక్‌లో.',
      expStep2Title: 'గిగ్‌క్రెడిట్ స్కోర్ పెంచుకోండి',
      expStep2Desc: 'ఆదాయ స్థిరత్వం ఆధారంగా (CIBIL అవసరం లేదు).',
      expStep3Title: 'రోజువారీ మైక్రో-EMI',
      expStep3Desc: 'రోజువారీ ఆదాయం నుండి స్వయంచాలక కట్ (ఉదా. ₹100/రోజు).',
      scoreTitle: 'గిగ్‌క్రెడిట్ స్కోర్',
      tenureTitle: 'పని నిలకడ',
      velocityTitle: 'మల్టీ-యాప్ వేగం',
      velocitySub: 'స్థిరత్వం > పరిమాణం (నెలవారీ పెరుగుదల ₹)',
      stabilityTitle: 'స్థిరత్వ సూచిక',
      incomeTitle: 'ధృవీకరించబడిన ఆదాయం (₹)',
      incomeSub: 'AA బ్యాంక్ స్టేట్‌మెంట్ & SMS ద్వారా',
      trustTitle: 'నమ్మకం స్కోర్',
      creditLineTitle: 'ముందస్తు ఆమోదిత రుణ పరిమితి',
      creditLineSub: 'తక్షణ నగదు అందుబాటులో ఉంది',
      requestNBFC: 'RBI NBFC ఆఫర్‌లను పొందండి',
      repTitle: 'పూర్తి క్రెడిట్ విశ్లేషణ',
      escrowTitle: 'ఎస్క్రో వ్యాలెట్ (₹)',
      linkedAppsTitle: 'కనెక్ట్ చేసిన పని యాప్‌లు',
      linkedAppsSub: 'భారతీయ యాప్‌ల నుండి సురక్షిత డేటా',
    },
    mr: {
      navBrand: 'गिगक्रेडिट वर्कर पोर्टल',
      greeting: 'नमस्कार,',
      runUnderwrite: '२-मिनिटात क्रेडिट तपासा',
      payoutSim: 'पेआउट आणि EMI तपासा',
      aaSync: 'बँक खाते जोडा (AA)',
      smsParse: 'SMS कमाई नोंदवा',
      instantDraw: 'UPI मध्ये ₹१,००० काढा',
      viewReport: 'क्रेडिट रिपोर्ट पहा',
      expStep1Title: 'कामाचे ॲप्स जोडा',
      expStep1Desc: 'Swiggy, Zomato, Uber, Blinkit एका क्लिकवर.',
      expStep2Title: 'गिगक्रेडिट स्कोर बनवा',
      expStep2Desc: 'तुमच्या कमाईच्या स्थिरतेवर आधारित (CIBIL ची गरज नाही).',
      expStep3Title: 'दैनिक मायक्रो-EMI',
      expStep3Desc: 'रोजच्या पेआउटमधून आपोआप कट होईल (उदा. ₹१००/दिवस).',
      scoreTitle: 'गिगक्रेडिट स्कोर',
      tenureTitle: 'कामाचे सातत्य',
      velocityTitle: 'मल्टी-ॲप कमाई गती',
      velocitySub: 'स्थिरता > प्रमाण (महिन्याकाठी वाढ ₹)',
      stabilityTitle: 'स्थिरता निर्देशांक',
      incomeTitle: 'सत्यापित उत्पन्न (₹)',
      incomeSub: 'बँक आणि एसएमएसद्वारे सत्यापित',
      trustTitle: 'ऑपरेशनल विश्वास',
      creditLineTitle: 'पूर्व-मंजूर कर्ज मर्यादा (₹)',
      creditLineSub: 'त्वरीत UPI हस्तांतरणासाठी उपलब्ध',
      requestNBFC: 'RBI NBFC ऑफर पहा',
      repTitle: 'संपूर्ण क्रेडिट विश्लेषण',
      escrowTitle: 'एस्क्रॉ वॉलेट (₹)',
      linkedAppsTitle: 'जोडलेले गिग वर्क ॲप्स',
      linkedAppsSub: 'प्रमुख भारतीय ॲप्समधून सुरक्षित डेटा',
    },
  };

  window.changeLanguage = (lang) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if ($('nav-brand-title')) $('nav-brand-title').textContent = dict.navBrand;
    if ($('welcome-greeting')) $('welcome-greeting').textContent = dict.greeting;
    if ($('btn-run-underwrite')) $('btn-run-underwrite').textContent = dict.runUnderwrite;
    if ($('btn-payout-sim')) $('btn-payout-sim').textContent = dict.payoutSim;
    if ($('act-aa-sync')) $('act-aa-sync').textContent = dict.aaSync;
    if ($('act-sms-parse')) $('act-sms-parse').textContent = dict.smsParse;
    if ($('act-instant-draw')) $('act-instant-draw').textContent = dict.instantDraw;
    if ($('act-view-report')) $('act-view-report').textContent = dict.viewReport;

    if ($('exp-step1-title')) $('exp-step1-title').textContent = dict.expStep1Title;
    if ($('exp-step1-desc')) $('exp-step1-desc').textContent = dict.expStep1Desc;
    if ($('exp-step2-title')) $('exp-step2-title').textContent = dict.expStep2Title;
    if ($('exp-step2-desc')) $('exp-step2-desc').textContent = dict.expStep2Desc;
    if ($('exp-step3-title')) $('exp-step3-title').textContent = dict.expStep3Title;
    if ($('exp-step3-desc')) $('exp-step3-desc').textContent = dict.expStep3Desc;

    if ($('lbl-score-title')) $('lbl-score-title').textContent = dict.scoreTitle;
    if ($('lbl-tenure-title')) $('lbl-tenure-title').textContent = dict.tenureTitle;
    if ($('lbl-velocity-title')) $('lbl-velocity-title').textContent = dict.velocityTitle;
    if ($('lbl-velocity-sub')) $('lbl-velocity-sub').textContent = dict.velocitySub;
    if ($('lbl-stability-title')) $('lbl-stability-title').textContent = dict.stabilityTitle;
    if ($('lbl-income-title')) $('lbl-income-title').textContent = dict.incomeTitle;
    if ($('lbl-income-sub')) $('lbl-income-sub').textContent = dict.incomeSub;
    if ($('lbl-trust-title')) $('lbl-trust-title').textContent = dict.trustTitle;
    if ($('lbl-credit-line-title')) $('lbl-credit-line-title').textContent = dict.creditLineTitle;
    if ($('lbl-credit-line-sub')) $('lbl-credit-line-sub').textContent = dict.creditLineSub;
    if ($('btn-request-nbfc')) $('btn-request-nbfc').textContent = dict.requestNBFC;
    if ($('rep-title')) $('rep-title').textContent = dict.repTitle;
    if ($('lbl-escrow-title')) $('lbl-escrow-title').textContent = dict.escrowTitle;
    if ($('lbl-linked-apps-title')) $('lbl-linked-apps-title').textContent = dict.linkedAppsTitle;
    if ($('lbl-linked-apps-sub')) $('lbl-linked-apps-sub').textContent = dict.linkedAppsSub;

    GigCreditAPI.showToast(`Language switched to ${lang.toUpperCase()}`, 'info');
  };

  async function loadDashboard() {
    try {
      const { dashboard } = await GigCreditAPI.getWorkerDashboard();

      // Populate Header & Welcome Info
      if ($('welcome-name')) $('welcome-name').textContent = dashboard.name;
      if ($('welcome-tagline')) $('welcome-tagline').textContent = `${dashboard.tagline || 'Swiggy & Zomato Captain'} • ${dashboard.city || 'Delhi NCR'} • ${dashboard.vehicleType || 'EV Scooter'}`;
      if ($('header-user-name')) $('header-user-name').textContent = dashboard.name;
      if ($('header-user-score')) $('header-user-score').textContent = `Score: ${dashboard.gigCreditScore}`;
      if (dashboard.avatarUrl && $('header-avatar')) $('header-avatar').src = dashboard.avatarUrl;

      if ($('sidebar-escrow-id')) $('sidebar-escrow-id').textContent = dashboard.escrowVirtualAccount?.accountId || 'ESCROW-9042-8819';
      if ($('escrow-account-mask')) $('escrow-account-mask').textContent = dashboard.escrowVirtualAccount?.accountId || 'ESCROW-9042-8819';

      // Scores & Underwriting
      if ($('banner-score')) $('banner-score').textContent = `${dashboard.gigCreditScore} / 900`;
      if ($('score-val')) $('score-val').textContent = dashboard.gigCreditScore;
      if ($('risk-tier-badge')) $('risk-tier-badge').textContent = dashboard.riskTier || 'Prime (Low Risk)';
      if ($('account-tenure')) $('account-tenure').textContent = `${dashboard.accountAgeMonths || 18} Months`;

      if ($('banner-aa-handle')) $('banner-aa-handle').textContent = dashboard.accountAggregatorConsent?.aaHandle || 'ramesh@finvu';

      // Metrics
      const metrics = dashboard.underwritingMetrics || {};
      if ($('velocity-val')) $('velocity-val').textContent = `+${metrics.multiAppIncomeVelocity || 14.8}%`;
      if ($('stability-val')) $('stability-val').textContent = `${metrics.incomeStabilityIndex || 92} / 100`;
      if ($('income-val')) $('income-val').textContent = fmtRupee(dashboard.monthlyIncome);
      if ($('trust-val')) $('trust-val').textContent = `${metrics.operationalTrustScore || 96}% High`;
      if ($('credit-limit-val')) $('credit-limit-val').textContent = fmtRupee(dashboard.loanEligibility || 120000);

      // Wallet
      if ($('wallet-balance-val')) $('wallet-balance-val').textContent = fmtRupee(dashboard.walletBalance);
      if ($('target-bank-val')) $('target-bank-val').textContent = `${dashboard.bankName || 'HDFC Bank'} (${dashboard.upiId || 'worker@okaxis'})`;
      if ($('banner-micro-emi')) $('banner-micro-emi').textContent = `₹${dashboard.microEMIDeductionRate || 100} Auto EMI/day`;

      // Full Report Card Sync
      if ($('rep-aa-handle')) $('rep-aa-handle').textContent = dashboard.accountAggregatorConsent?.aaHandle || 'ramesh@finvu';
      if ($('rep-sms-earnings')) $('rep-sms-earnings').textContent = fmtRupee(dashboard.monthlyIncome);
      if ($('rep-kyc')) $('rep-kyc').textContent = `PAN: ${dashboard.kycStatus?.panNumber || 'ABCDE1234F'} • Aadhaar: •••• ${dashboard.kycStatus?.aadhaarLast4 || '9924'}`;
      if ($('rep-upi')) $('rep-upi').textContent = dashboard.upiId || 'worker@okaxis';
      if ($('rep-auto-emi')) $('rep-auto-emi').textContent = `Auto-Carve EMI: ₹${dashboard.microEMIDeductionRate || 100} / daily payout`;

      renderPlatforms(dashboard.connectedPlatforms || []);
      renderOffers(dashboard.loanOffers || []);
      renderActiveLoans(dashboard.activeLoans || []);
      loadDemoSwitcher();

      // Fresh Account Auto-Onboarding Trigger
      if (window.location.search.includes('onboard=true') || !(dashboard.connectedPlatforms && dashboard.connectedPlatforms.length)) {
        setTimeout(() => openWizardModal(), 400);
      }
    } catch (err) {
      GigCreditAPI.showToast(err.message || 'Error loading dashboard', 'error');
    }
  }

  function getPlatformColor(name) {
    const map = {
      Swiggy: 'from-orange-500 to-amber-500 text-white',
      Zomato: 'from-red-600 to-rose-500 text-white',
      Zepto: 'from-purple-600 to-indigo-600 text-white',
      Blinkit: 'from-yellow-400 to-amber-400 text-slate-900',
      'Uber India': 'from-slate-900 to-slate-800 text-white',
      Ola: 'from-lime-500 to-emerald-600 text-slate-900',
      Porter: 'from-blue-600 to-cyan-600 text-white',
      Rapido: 'from-amber-400 to-yellow-500 text-slate-900',
      'Urban Company': 'from-slate-800 to-slate-950 text-white',
      Shadowfax: 'from-teal-600 to-emerald-600 text-white',
    };
    return map[name] || 'from-blue-600 to-indigo-600 text-white';
  }

  function renderPlatforms(connected) {
    const connectedNames = connected.map((p) => p.platform);
    const container = $('connected-platforms-container');
    if (!container) return;

    let html = connected
      .map(
        (p) => `
      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-primary transition-all">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br ${getPlatformColor(p.platform)} font-bold flex items-center justify-center text-xs font-mono shadow-sm">
              ${p.platform.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span class="text-xs font-extrabold text-on-surface block font-headline">${p.platform}</span>
              <span class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified via AA &amp; SMS
              </span>
            </div>
          </div>
          <button onclick="disconnectPlatform('${p.platform}')" class="text-[11px] font-semibold text-rose-500 hover:text-rose-700 hover:underline">Disconnect</button>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-left">
          <div class="p-2 bg-slate-50 rounded-lg">
            <span class="text-[9px] font-bold text-slate-400 block font-mono">MONTHLY EARNINGS</span>
            <span class="text-xs font-bold font-mono text-primary">${fmtRupee(p.monthlyEarnings)}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-lg">
            <span class="text-[9px] font-bold text-slate-400 block font-mono">RATING / JOBS</span>
            <span class="text-xs font-bold font-mono text-slate-800">${p.rating.toFixed(1)}★ • ${p.completedJobs}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-lg">
            <span class="text-[9px] font-bold text-slate-400 block font-mono">CANCELLATION</span>
            <span class="text-xs font-bold font-mono text-emerald-600">${p.cancellationRate}% Low</span>
          </div>
        </div>
      </div>`
      )
      .join('');

    const unconnected = ALL_PLATFORMS.filter((p) => !connectedNames.includes(p));
    if (unconnected.length) {
      unconnected.forEach((p) => {
        html += `
        <button onclick="connectPlatform('${p}')" class="p-4 bg-slate-50/70 hover:bg-white border border-dashed border-slate-300 hover:border-primary rounded-2xl flex items-center justify-between text-xs text-primary font-bold transition-all shadow-sm group">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs font-mono group-hover:bg-primary group-hover:text-white transition-colors">
              +
            </div>
            <div class="text-left">
              <span class="block text-slate-700 font-bold group-hover:text-primary">Connect ${p}</span>
              <span class="text-[10px] text-slate-400 font-normal">Sync AA Statement &amp; SMS Logs</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary">add_circle</span>
        </button>`;
      });
    }

    container.innerHTML = html;
  }

  window.connectPlatform = async (platform) => {
    try {
      await GigCreditAPI.connectPlatform(platform);
      GigCreditAPI.showToast(`Connected ${platform}! Score updated.`, 'success');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  window.disconnectPlatform = async (platform) => {
    try {
      await GigCreditAPI.disconnectPlatform(platform);
      GigCreditAPI.showToast(`Disconnected ${platform}. Score updated.`, 'info');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  // Quick Action Handlers
  window.triggerAAFetchQuick = async () => {
    try {
      GigCreditAPI.showToast('Connecting to Finvu AA & retrieving bank statement...', 'info');
      const res = await GigCreditAPI.fetchAAData();
      GigCreditAPI.showToast(res.message, 'success');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  window.openSMSQuickModal = () => $('sms-modal').classList.remove('hidden'), $('sms-modal').classList.add('flex');
  window.closeSMSQuickModal = () => $('sms-modal').classList.add('hidden'), $('sms-modal').classList.remove('flex');
  window.submitQuickSMSParse = async () => {
    const text = $('quick-sms-input').value;
    try {
      const res = await GigCreditAPI.parseSMS(text);
      GigCreditAPI.showToast(`Parsed ${res.parsed.detectedPlatform} payout of ₹${res.parsed.extractedEarnings}!`, 'success');
      closeSMSQuickModal();
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  window.openQuickCashModal = async () => {
    const amount = window.prompt('Enter amount to draw into your UPI account (₹):', '1000');
    if (!amount) return;
    try {
      await GigCreditAPI.withdraw(Number(amount));
      GigCreditAPI.showToast(`Disbursed ₹${amount} directly to your UPI bank account!`, 'success');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  window.scrollToReport = () => {
    $('underwriting-report-card').scrollIntoView({ behavior: 'smooth' });
  };

  function renderOffers(offers) {
    const container = $('loan-offers-container');
    if (!container) return;
    const available = offers.filter((o) => o.status === 'available');

    if (!available.length) {
      container.innerHTML = `<div class="col-span-3 text-xs text-slate-500 p-4 bg-slate-50 rounded-xl">No active offers. Click "Trigger 60s NBFC Reverse Auction" to match with lenders.</div>`;
      return;
    }

    container.innerHTML = available
      .map(
        (o) => `
      <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex justify-between items-start">
          <span class="text-xs font-bold text-on-surface font-headline">${o.title}</span>
          <span class="text-[10px] px-2 py-0.5 bg-blue-50 text-primary font-bold font-mono rounded">${o.interestRate}% APR</span>
        </div>
        <div class="text-2xl font-bold font-mono text-primary">${fmtRupee(o.amount)}</div>
        <div class="text-[11px] text-slate-500">${o.tenureMonths} Months Tenure • ${o.purpose || 'General Purpose'}</div>
        <div class="flex gap-2 pt-1">
          <button onclick="acceptOffer('${o._id}')" class="flex-1 bg-secondary text-white font-semibold text-xs py-2 rounded-lg hover:bg-emerald-700">Accept &amp; Disburse</button>
          <button onclick="rejectOffer('${o._id}')" class="px-3 border border-slate-200 text-xs text-slate-500 rounded-lg hover:border-rose-300 hover:text-rose-600">Skip</button>
        </div>
      </div>`
      )
      .join('');
  }

  window.acceptOffer = async (id) => {
    try {
      const res = await GigCreditAPI.acceptOffer(id);
      GigCreditAPI.showToast(`Loan disbursed! ${fmtRupee(res.loan.principal)} added to Escrow Virtual Wallet.`, 'success');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  window.rejectOffer = async (id) => {
    try {
      await GigCreditAPI.rejectOffer(id);
      GigCreditAPI.showToast('Offer skipped.', 'info');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  function renderActiveLoans(loans) {
    const container = $('active-loans-container');
    if (!container) return;

    if (!loans.length) {
      container.innerHTML = `<p class="text-xs text-slate-500 p-3 bg-slate-50 rounded-xl">No active loans. Accept an offer above to disburse funds.</p>`;
      return;
    }

    container.innerHTML = loans
      .map(
        (l) => `
      <div class="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <span class="text-xs font-bold text-on-surface block font-headline">${l.title}</span>
          <span class="text-[11px] text-slate-500">EMI: ${fmtRupee(l.monthlyEMI)}/mo • Outstanding: <strong class="text-slate-800 font-mono">${fmtRupee(l.outstandingBalance)}</strong> of ${fmtRupee(l.principal)}</span>
        </div>
        <button onclick="repayLoan('${l._id}', ${l.monthlyEMI})" class="bg-primary text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-blue-700">
          Pay EMI (${fmtRupee(l.monthlyEMI)})
        </button>
      </div>`
      )
      .join('');
  }

  window.repayLoan = async (loanId, amount) => {
    try {
      await GigCreditAPI.repayLoan(loanId, amount);
      GigCreditAPI.showToast(`Paid ${fmtRupee(amount)} EMI repayment cleanly!`, 'success');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  // Wizard Modal Functions
  window.openWizardModal = () => $('wizard-modal').classList.remove('hidden'), $('wizard-modal').classList.add('flex');
  window.closeWizardModal = () => $('wizard-modal').classList.add('hidden'), $('wizard-modal').classList.remove('flex');

  // Aadhaar OTP Authentication Handlers
  window.sendAadhaarOTP = () => {
    const phone = $('wiz-phone').value;
    const aadhaar = $('wiz-aadhaar-input').value;
    if (!phone || !aadhaar) {
      GigCreditAPI.showToast('Please enter mobile number and Aadhaar number.', 'error');
      return;
    }
    const otpInput = $('wiz-otp-input');
    const verifyBtn = $('btn-verify-otp');
    if (otpInput && verifyBtn) {
      otpInput.classList.remove('hidden');
      verifyBtn.classList.remove('hidden');
      otpInput.value = '992410'; // Simulated 6-digit OTP
      GigCreditAPI.showToast('Aadhaar OTP sent! Test OTP: 992410', 'info');
    }
  };

  window.verifyAadhaarOTP = async () => {
    const phone = $('wiz-phone').value;
    const aadhaar = $('wiz-aadhaar-input').value;
    const otp = $('wiz-otp-input')?.value || '992410';
    try {
      const res = await GigCreditAPI.verifyAadhaarOTP({ phone, aadhaarNumber: aadhaar, otp });
      GigCreditAPI.showToast(res.message, 'success');
      if ($('aadhaar-status-badge')) {
        $('aadhaar-status-badge').className = 'text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full';
        $('aadhaar-status-badge').textContent = '✓ Aadhaar Verified (UIDAI)';
      }
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  // Animated Live Backend Data Fetching Progress Modal Handler
  window.submitFullUnderwriting = async () => {
    try {
      closeWizardModal();

      const modal = $('backend-fetch-modal');
      const progressBar = $('backend-progress-bar');
      const progressPct = $('backend-progress-pct');
      const logsFeed = $('backend-logs-feed');

      if (!modal) return;

      modal.classList.remove('hidden');
      modal.classList.add('flex');

      logsFeed.innerHTML = '<div class="text-blue-400 font-bold">[0.1s] 🔒 Contacting RBI Finvu Account Aggregator Gateway...</div>';
      progressBar.style.width = '20%';
      progressPct.textContent = '20%';

      await new Promise((r) => setTimeout(r, 600));
      logsFeed.innerHTML += '<div class="text-emerald-400 font-bold">[0.7s] 🏦 Retrieving 12-Month Deposit Statement from HDFC &amp; ICICI... (DONE ✓)</div>';
      progressBar.style.width = '45%';
      progressPct.textContent = '45%';

      await new Promise((r) => setTimeout(r, 700));
      logsFeed.innerHTML += '<div class="text-amber-400 font-bold">[1.4s] 📱 Scraping Swiggy, Zomato &amp; Blinkit Payout SMS Alerts... (DONE ✓)</div>';
      progressBar.style.width = '70%';
      progressPct.textContent = '70%';

      await new Promise((r) => setTimeout(r, 700));
      logsFeed.innerHTML += '<div class="text-purple-400 font-bold">[2.1s] 📊 Calculating Multi-App Velocity &amp; Operational Trust Index...</div>';
      progressBar.style.width = '90%';
      progressPct.textContent = '90%';

      const payload = {
        name: $('wiz-name').value,
        phone: $('wiz-phone').value,
        city: $('wiz-city').value,
        vehicleType: $('wiz-vehicle').value,
        upiId: $('wiz-upi').value,
        panNumber: $('wiz-pan').value,
        aaHandle: $('wiz-aa-handle').value,
        smsSampleText: $('wiz-sms').value,
      };

      const res = await GigCreditAPI.underwriteFullAnalysis(payload);

      await new Promise((r) => setTimeout(r, 600));
      logsFeed.innerHTML += `<div class="text-emerald-300 font-bold">[2.8s] ⚡ ${res.message}</div>`;
      progressBar.style.width = '100%';
      progressPct.textContent = '100%';

      await new Promise((r) => setTimeout(r, 800));

      modal.classList.add('hidden');
      modal.classList.remove('flex');

      GigCreditAPI.showToast(res.message, 'success');
      loadDashboard();
      scrollToReport();
    } catch (err) {
      if ($('backend-fetch-modal')) {
        $('backend-fetch-modal').classList.add('hidden');
        $('backend-fetch-modal').classList.remove('flex');
      }
      GigCreditAPI.showToast(err.message || 'Error running underwriting', 'error');
    }
  };

  // Step 8: Closed-Loop Micro-EMI Payout Simulation
  window.triggerSimulatePayout = async () => {
    try {
      const res = await GigCreditAPI.simulatePayout(1850, 'Swiggy');
      GigCreditAPI.showToast(res.message, 'success');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  // Step 5: Reverse-Auction Bidding
  window.triggerReverseAuction = async () => {
    try {
      GigCreditAPI.showToast('Initiating 60-second RBI NBFC Reverse Auction...', 'info');
      const res = await GigCreditAPI.requestBids();
      GigCreditAPI.showToast(res.message, 'success');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  window.loadDemoSwitcher = async () => {
    try {
      const data = await GigCreditAPI.getDemoAccounts();
      const list = $('switcher-items-list');
      if (!list) return;
      list.innerHTML = '';

      (data.workers || []).forEach((w) => {
        const item = document.createElement('div');
        item.className = 'profile-item-row text-xs font-semibold text-slate-700';
        item.onclick = async () => {
          const res = await GigCreditAPI.switchDemoAccount(w.id, 'worker');
          GigCreditAPI.saveSession(res.token, res.role, res.user);
          window.location.reload();
        };
        item.innerHTML = `
          <img src="${w.avatarUrl}" class="w-6 h-6 rounded-full object-cover"/>
          <span>${w.name} (${w.gigCreditScore}) • ${w.city || 'Delhi'}</span>`;
        list.appendChild(item);
      });

      (data.lenders || []).forEach((l) => {
        const item = document.createElement('div');
        item.className = 'profile-item-row text-xs font-semibold text-emerald-700';
        item.onclick = async () => {
          const res = await GigCreditAPI.switchDemoAccount(l.id, 'lender');
          GigCreditAPI.saveSession(res.token, res.role, res.user);
          window.location.href = 'lender.html';
        };
        item.innerHTML = `
          <img src="${l.avatarUrl}" class="w-6 h-6 rounded-full object-cover"/>
          <span>${l.name}</span>`;
        list.appendChild(item);
      });
    } catch (err) {
      console.log('Error loading demo switcher:', err);
    }
  };

  $('withdraw-btn').addEventListener('click', async () => {
    const amount = window.prompt('Enter amount to sweep to primary bank account (₹):');
    if (!amount) return;
    try {
      await GigCreditAPI.withdraw(Number(amount));
      GigCreditAPI.showToast(`Swept ₹${amount} to linked savings account via UPI!`, 'success');
      loadDashboard();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  });

  $('logout-btn').addEventListener('click', () => {
    GigCreditAPI.logout();
    window.location.href = 'login.html';
  });

  loadDashboard();
})();
