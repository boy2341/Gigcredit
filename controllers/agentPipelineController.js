const AgentOrchestrator = require('../agents/AgentOrchestrator');
const Worker = require('../models/Worker');
const fs = require('fs');
const path = require('path');

/**
 * POST /api/agents/run-pipeline
 * Runs the 7-Stage Multi-Agent Underwriting & Fraud Analysis Pipeline
 */
const runPipeline = async (req, res, next) => {
  try {
    const inputData = {
      name: req.body.name || req.user?.name || 'Ramesh Kumar',
      phone: req.body.phone || req.user?.phone || '+91 98765 43210',
      documentName: req.body.documentName || req.body.bankDoc || 'hdfc_bank_statement_july.png',
      payoutDoc: req.body.payoutDoc || 'swiggy_zomato_weekly_payout.png',
      ratingDoc: req.body.ratingDoc || 'fleet_captain_4_9_star_badge.png',
      upiDoc: req.body.upiDoc || 'upi_phonepe_history_july.png',
      selectedPlatforms: req.body.selectedPlatforms || ['Swiggy', 'Zomato', 'Blinkit'],
      smsSampleText: req.body.smsSampleText || 'Alert: Swiggy weekly payout ₹4,625 deposited to Escrow HDFC0000240',
      accountAgeMonths: req.user?.accountAgeMonths || 18,
    };

    const context = await AgentOrchestrator.runPipeline(inputData);

    // Sync computed GigScore and report if user authenticated
    if (req.user) {
      const worker = req.user;
      worker.gigCreditScore = context.gigScore.score;
      worker.riskTier = context.gigScore.riskTier;
      worker.scoreBreakdown = context.gigScore.scoreBreakdown;
      worker.microEMIDeductionRate = context.gigScore.dailyAutoEMI;

      worker.fullUnderwritingReport = {
        generatedAt: new Date(),
        gigCreditScore: context.gigScore.score,
        riskTier: context.gigScore.riskTier,
        verifiedMonthlyIncome: context.gigScore.verifiedMonthlyIncome,
        approvedCreditLine: context.gigScore.approvedCreditLine,
        dailyAutoEMI: context.gigScore.dailyAutoEMI,
        aaConsentId: worker.accountAggregatorConsent?.consentId || 'AA-FINVU-9924',
        smsIngestedAlertsCount: 14,
        fipBanks: ['HDFC Bank Escrow Services', 'ICICI Bank', 'State Bank of India'],
      };

      await worker.save();
    }

    res.json({
      success: true,
      message: `7-Stage Multi-Agent Pipeline Completed! Selected combination -> GigScore: ${context.gigScore.score} (${context.gigScore.riskTier}). Approved Credit Line: ₹${context.gigScore.approvedCreditLine.toLocaleString('en-IN')}`,
      pipelineResults: {
        sessionId: context.sessionId,
        timestamp: context.timestamp,
        document: context.document,
        extraction: context.extraction,
        verification: context.verification,
        crossVerification: context.crossVerification,
        behavior: context.behavior,
        gigScore: context.gigScore,
        explanation: context.explanation,
        timeline: context.timeline,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/agents/latest-audit
 */
const getLatestAudit = async (req, res, next) => {
  try {
    const defaultInput = {
      name: req.user?.name || 'Ramesh Kumar',
      selectedPlatforms: ['Swiggy', 'Zomato', 'Blinkit'],
    };
    const context = await AgentOrchestrator.runPipeline(defaultInput);

    res.json({
      success: true,
      audit: {
        sessionId: context.sessionId,
        gigScore: context.gigScore.score,
        riskTier: context.gigScore.riskTier,
        approvedCreditLine: context.gigScore.approvedCreditLine,
        explanation: context.explanation,
        timeline: context.timeline,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/agents/bigdata-analytics
 */
const getBigDataAnalytics = async (req, res, next) => {
  try {
    const analyticsPath = path.join(__dirname, '..', 'uploads', 'big_data_underwriting_analytics.json');
    if (fs.existsSync(analyticsPath)) {
      const data = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
      return res.json({ success: true, analytics: data });
    }
    res.json({
      success: true,
      analytics: {
        totalDriversScored: 150,
        averageGigScore: 754,
        totalCreditFacilityUnderwrittenINR: 2003000,
        avgProcessingTimePerDriverMs: "1.43ms",
      },
    });
  } catch (err) {
    next(err);
  }
};

const CopilotAgent = require('../agents/CopilotAgent');

/**
 * POST /api/agents/copilot
 */
const queryCopilot = async (req, res, next) => {
  try {
    const { query, userRole, contextData } = req.body;
    let pipelineCtx = contextData;
    if (!pipelineCtx) {
      const defaultInput = {
        name: req.user?.name || 'Ramesh Kumar',
        selectedPlatforms: ['Swiggy', 'Zomato', 'Blinkit'],
      };
      pipelineCtx = await AgentOrchestrator.runPipeline(defaultInput);
    }

    const copilotResult = await CopilotAgent.query({
      query: query || 'Why did my score improve?',
      userRole: userRole || (req.user?.role === 'lender' ? 'lender' : 'worker'),
      contextData: pipelineCtx,
    });

    res.json(copilotResult);
  } catch (err) {
    next(err);
  }
};

module.exports = { runPipeline, getLatestAudit, getBigDataAnalytics, queryCopilot };
