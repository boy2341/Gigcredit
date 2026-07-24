const { calculateGigScore } = require('../utils/gigScore');

// @desc GET /api/gigscore/me
const getMyScore = async (req, res) => {
  const worker = req.user;
  res.json({
    success: true,
    score: worker.gigCreditScore,
    breakdown: worker.scoreBreakdown,
    riskTier: worker.riskTier,
    lastUpdated: worker.lastScoreUpdate,
    accountAgeMonths: worker.accountAgeMonths,
  });
};

// @desc POST /api/gigscore/recalculate
// Manually re-runs the scoring model against current platform data (e.g. after connecting a new platform)
const recalculate = async (req, res, next) => {
  try {
    const worker = req.user;
    const { score, breakdown, riskTier } = calculateGigScore({
      platforms: worker.connectedPlatforms,
      accountAgeMonths: worker.accountAgeMonths,
    });
    worker.gigCreditScore = score;
    worker.scoreBreakdown = breakdown;
    worker.riskTier = riskTier;
    worker.lastScoreUpdate = new Date();
    await worker.save();

    res.json({ success: true, score, breakdown, riskTier });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyScore, recalculate };
