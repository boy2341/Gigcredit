const Worker = require('../models/Worker');
const Wallet = require('../models/Wallet');
const { calculateGigScore, calculateMonthlyIncome } = require('../utils/gigScore');
const { getOrCreateWallet } = require('./walletController');

// 1. THE INTAKE ENDPOINT (/api/sync)
// Accepts a user phone number and returns a "Success" status to simulate SMS scraping and Account Aggregator connection.
const syncIntake = async (req, res, next) => {
  try {
    const phone = req.body.phone || req.user?.phone || '+91 98765 43210';
    let worker = await Worker.findOne({ phone });
    if (!worker && req.user) worker = req.user;
    if (!worker) worker = await Worker.findOne({});

    const aaHandle = worker ? (worker.accountAggregatorConsent?.aaHandle || `${worker.email.split('@')[0]}@finvu`) : 'ramesh@finvu';
    const platforms = worker ? worker.connectedPlatforms.map((p) => p.platform) : ['Swiggy', 'Zomato', 'Blinkit', 'Zepto'];

    res.json({
      success: true,
      status: 'Success',
      message: 'SMS scraping and Account Aggregator connection active',
      syncedPhone: phone,
      aaHandle,
      consentId: worker?.accountAggregatorConsent?.consentId || 'AA-FINVU-9924',
      provider: 'Finvu AA Rails',
      platformsDetected: platforms,
      lastSmsParsed: `Alert: Your ${platforms[0] || 'Swiggy'} weekly payout of ₹1,850 was ingested via SMS parser into Escrow HDFC0000240.`,
      timestamp: new Date(),
    });
  } catch (err) {
    next(err);
  }
};

// 2. THE ENGINE ENDPOINT (/api/score)
// Returns a JSON payload containing the structured score (742), synced platform earnings, and behavioral metrics log rows.
const getStructuredScore = async (req, res, next) => {
  try {
    let worker = req.user;
    if (!worker) worker = await Worker.findOne({ name: 'Ramesh Kumar' });
    if (!worker) worker = await Worker.findOne({});

    const score = worker ? worker.gigCreditScore : 742;
    const monthlyIncome = worker ? calculateMonthlyIncome(worker.connectedPlatforms) : 42500;
    const metrics = worker?.underwritingMetrics || {
      multiAppIncomeVelocity: 14.8,
      incomeStabilityIndex: 92,
      operationalTrustScore: 96,
      loginConsistencyDays: 27,
      avgDailyHours: 8.5,
    };

    res.json({
      success: true,
      score,
      riskTier: worker?.riskTier || 'Prime (Low Risk)',
      scoreBreakdown: worker?.scoreBreakdown || {
        earningsScore: 310,
        ratingScore: 185,
        reliabilityScore: 142,
        tenureScore: 105,
      },
      syncedEarnings: {
        monthlyTotal: monthlyIncome,
        currency: 'INR (₹)',
        platforms: worker?.connectedPlatforms || [
          { platform: 'Swiggy', monthlyEarnings: 18500, rating: 4.9, completedJobs: 1250 },
          { platform: 'Zomato', monthlyEarnings: 14000, rating: 4.8, completedJobs: 980 },
          { platform: 'Blinkit', monthlyEarnings: 10000, rating: 4.95, completedJobs: 640 },
        ],
      },
      behavioralMetricsLog: [
        {
          timestamp: new Date().toISOString(),
          metric: 'Multi-App Income Velocity',
          value: `+${metrics.multiAppIncomeVelocity || 14.8}% MoM Growth`,
          status: 'EXCELLENT',
        },
        {
          timestamp: new Date().toISOString(),
          metric: 'Income Stability Index',
          value: `${metrics.incomeStabilityIndex || 92}/100`,
          status: 'HIGHLY_STABLE',
        },
        {
          timestamp: new Date().toISOString(),
          metric: 'Operational Trust Score',
          value: `${metrics.operationalTrustScore || 96}% Order Completion`,
          status: 'HIGH_TRUST',
        },
        {
          timestamp: new Date().toISOString(),
          metric: 'Login Consistency',
          value: `${metrics.loginConsistencyDays || 27} Active Days/Month`,
          status: 'CONSISTENT',
        },
      ],
      kycVerified: worker?.kycStatus?.verified ?? true,
      escrowAccount: worker?.escrowVirtualAccount?.accountId || 'ESCROW-9042-8819',
    });
  } catch (err) {
    next(err);
  }
};

// 3. THE ESCROW ENDPOINT (/api/withdraw)
// Simulates a cash withdrawal and calculates the daily auto-carve micro-EMI amount automatically.
const escrowWithdrawal = async (req, res, next) => {
  try {
    const requestedAmount = Number(req.body.amount) || 2500;
    const phone = req.body.phone || req.user?.phone;

    let worker = req.user;
    if (!worker && phone) worker = await Worker.findOne({ phone });
    if (!worker) worker = await Worker.findOne({});

    const dailyMicroEMI = worker?.microEMIDeductionRate || 100;
    const netDisbursed = Math.max(requestedAmount - dailyMicroEMI, 0);

    let walletBalance = 12500;
    if (worker) {
      const wallet = await getOrCreateWallet(worker._id);
      wallet.balance = Math.max(wallet.balance - requestedAmount, 0);
      wallet.transactions.unshift({
        type: 'debit',
        category: 'withdrawal',
        amount: requestedAmount,
        description: `Cash withdrawal with ₹${dailyMicroEMI} daily auto-carve micro-EMI`,
        source: 'Escrow Virtual Gateway (HDFC0000240)',
        date: new Date(),
      });
      await wallet.save();
      walletBalance = wallet.balance;
    }

    res.json({
      success: true,
      status: 'Success',
      message: `Cash withdrawal processed. ₹${dailyMicroEMI} daily auto-carve micro-EMI automatically deducted at Escrow source. Net ₹${netDisbursed.toLocaleString('en-IN')} disbursed to primary bank account.`,
      requestedWithdrawal: requestedAmount,
      autoCarveMicroEMI: dailyMicroEMI,
      netDisbursedToPrimaryBank: netDisbursed,
      escrowVirtualAccountId: worker?.escrowVirtualAccount?.accountId || 'ESCROW-9042-8819',
      ifscCode: 'HDFC0000240',
      primaryBank: `${worker?.bankName || 'HDFC Bank'} (${worker?.bankAccountMasked || '****4821'})`,
      upiId: worker?.upiId || 'worker@okaxis',
      remainingWalletBalance: walletBalance,
      timestamp: new Date(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { syncIntake, getStructuredScore, escrowWithdrawal };
