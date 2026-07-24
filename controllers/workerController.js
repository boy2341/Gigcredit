const Worker = require('../models/Worker');
const Wallet = require('../models/Wallet');
const LoanOffer = require('../models/LoanOffer');
const { calculateGigScore, calculateMonthlyIncome } = require('../utils/gigScore');
const { GIG_PLATFORMS, generatePlatformData, generateSystemLoanOffers } = require('../utils/mockData');

// @desc GET /api/workers/me
const getProfile = async (req, res) => {
  res.json({ success: true, worker: req.user.toSafeObject() });
};

// @desc PUT /api/workers/me
const updateProfile = async (req, res, next) => {
  try {
    const editable = ['name', 'phone', 'dateOfBirth', 'city', 'address', 'panNumber', 'aadhaarLast4'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    await req.user.save();
    res.json({ success: true, worker: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc GET /api/workers/platforms
const listPlatforms = async (req, res) => {
  res.json({
    success: true,
    available: GIG_PLATFORMS,
    connected: req.user.connectedPlatforms,
  });
};

// @desc POST /api/workers/platforms/connect  { platform }
// Simulates an OAuth-style connection to a gig platform and backfills demo stats
const connectPlatform = async (req, res, next) => {
  try {
    const { platform } = req.body;
    if (!GIG_PLATFORMS.includes(platform)) {
      return res.status(400).json({ success: false, message: `platform must be one of: ${GIG_PLATFORMS.join(', ')}` });
    }

    const worker = req.user;
    const alreadyConnected = worker.connectedPlatforms.some((p) => p.platform === platform);
    if (alreadyConnected) {
      return res.status(400).json({ success: false, message: `${platform} is already connected` });
    }

    worker.connectedPlatforms.push(generatePlatformData(platform));
    // Every new platform connection nudges account age forward a bit (demo flavor)
    worker.accountAgeMonths = Math.max(worker.accountAgeMonths, worker.connectedPlatforms.length * 2);

    const { score, breakdown, riskTier } = calculateGigScore({
      platforms: worker.connectedPlatforms,
      accountAgeMonths: worker.accountAgeMonths,
    });
    worker.gigCreditScore = score;
    worker.scoreBreakdown = breakdown;
    worker.riskTier = riskTier;
    worker.lastScoreUpdate = new Date();

    await worker.save();

    // Refresh system-generated loan offers based on new score/income
    const monthlyIncome = calculateMonthlyIncome(worker.connectedPlatforms);
    await LoanOffer.deleteMany({ worker: worker._id, source: 'system', status: 'available' });
    const offers = generateSystemLoanOffers({ score, monthlyIncome });
    await LoanOffer.insertMany(offers.map((o) => ({ ...o, worker: worker._id })));

    res.json({ success: true, worker: worker.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc DELETE /api/workers/platforms/:platform
const disconnectPlatform = async (req, res, next) => {
  try {
    const worker = req.user;
    const before = worker.connectedPlatforms.length;
    worker.connectedPlatforms = worker.connectedPlatforms.filter((p) => p.platform !== req.params.platform);

    if (worker.connectedPlatforms.length === before) {
      return res.status(404).json({ success: false, message: 'Platform not connected' });
    }

    const { score, breakdown, riskTier } = calculateGigScore({
      platforms: worker.connectedPlatforms,
      accountAgeMonths: worker.accountAgeMonths,
    });
    worker.gigCreditScore = score;
    worker.scoreBreakdown = breakdown;
    worker.riskTier = riskTier;

    await worker.save();
    res.json({ success: true, worker: worker.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/workers/bank/connect  { bankName, accountNumber }
// Simulates linking a bank account (no real banking integration)
const connectBank = async (req, res, next) => {
  try {
    const { bankName, accountNumber } = req.body;
    if (!bankName || !accountNumber) {
      return res.status(400).json({ success: false, message: 'bankName and accountNumber are required' });
    }
    const worker = req.user;
    worker.bankConnected = true;
    worker.bankName = bankName;
    worker.bankAccountMasked = `****${String(accountNumber).slice(-4)}`;
    await worker.save();
    res.json({ success: true, worker: worker.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, listPlatforms, connectPlatform, disconnectPlatform, connectBank };
