/**
 * ============================================================================
 * GigCredit - PipelineContext (Shared Memory & Context Manager)
 * ============================================================================
 * 
 * Provides a unified, thread-safe memory object passed sequentially across
 * all 7 agents in the multi-agent pipeline. Every agent reads from and enriches
 * this context.
 */

class PipelineContext {
  constructor(initialData = {}) {
    this.sessionId = `SESS-${Date.now()}-${Math.floor(Math.random() * 899 + 100)}`;
    this.timestamp = new Date().toISOString();
    
    this.worker = {
      name: initialData.name || 'Ramesh Kumar',
      phone: initialData.phone || '+91 98765 43210',
      city: initialData.city || 'Bengaluru',
      vehicleType: initialData.vehicleType || 'EV Scooter',
      accountAgeMonths: initialData.accountAgeMonths || 18,
    };

    this.rawInput = {
      documentName: initialData.documentName || initialData.bankDoc || 'hdfc_bank_statement_july.png',
      bankDoc: initialData.bankDoc || initialData.documentName || 'hdfc_bank_statement_july.png',
      payoutDoc: initialData.payoutDoc || 'swiggy_zomato_weekly_payout.png',
      ratingDoc: initialData.ratingDoc || 'fleet_captain_4_9_star_badge.png',
      upiDoc: initialData.upiDoc || 'upi_phonepe_history_july.png',
      documentBuffer: initialData.documentBuffer || null,
      smsSampleText: initialData.smsSampleText || 'Alert: Swiggy payout ₹4,625 deposited to Escrow HDFC0000240',
      selectedPlatforms: initialData.selectedPlatforms || ['Swiggy', 'Zomato', 'Blinkit'],
      ...initialData,
    };

    // Stage 1: Document Intelligence
    this.document = {
      documentType: null,
      mimeType: 'application/pdf',
      confidenceScore: 0,
    };

    // Stage 2: Data Extraction
    this.extraction = {
      rawText: '',
      accountNumberMasked: '****4821',
      bankName: 'HDFC Bank',
      extractedMonthlyEarnings: 0,
      platformBreakdown: [],
      transactionCount: 0,
      extractedRatings: {},
    };

    // Stage 3: Verification & Fraud Audit
    this.verification = {
      authenticityPassed: true,
      fraudScore: 0, // 0 = Clean, 100 = Fraud
      tamperFlags: [],
      metadataCheck: 'PASSED',
      balanceContinuity: 'VERIFIED',
    };

    // Stage 4: Cross Verification (Bank vs Platform Payouts)
    this.crossVerification = {
      platformDepositsMatched: true,
      dataConfidenceScore: 0, // 0-100%
      variancePercent: 0,
      matchedTransactions: [],
      discrepancyAlerts: [],
    };

    // Stage 5: Behaviour Analysis
    this.behavior = {
      incomeStabilityIndex: 0,
      operationalTrustScore: 0,
      multiAppIncomeVelocity: 0,
      workFrequencyDays: 27,
      ratingAverage: 4.85,
    };

    // Stage 6: GigScore Engine
    this.gigScore = {
      score: 300,
      riskTier: 'Starter (Higher Risk)',
      approvedCreditLine: 0,
      dailyAutoEMI: 0,
      scoreBreakdown: {},
    };

    // Stage 7: Explainability Report
    this.explanation = {
      summary: '',
      hinglishSummary: '',
      keyScoreBoosters: [],
      riskMitigants: [],
      actionableTips: [],
    };

    // Live Execution Timeline Log (For Demo UI)
    this.timeline = [];
  }

  /**
   * Log step progress into context timeline
   */
  logStep(stageId, stageName, status, details = '') {
    const entry = {
      step: stageId,
      name: stageName,
      status, // IN_PROGRESS, COMPLETED, WARNING, FAILED
      timestamp: new Date().toLocaleTimeString(),
      details,
    };
    this.timeline.push(entry);
    return entry;
  }
}

module.exports = PipelineContext;
