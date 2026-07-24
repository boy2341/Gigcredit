/**
 * Calculates a 300-900 "GigCredit Score" from a worker's connected-platform
 * data. This is intentionally simple/transparent for demo purposes - it is
 * NOT a real credit model.
 *
 * Weighting:
 *   40% earnings consistency (avg monthly earnings across platforms)
 *   25% average rating (out of 5)
 *   20% reliability (inverse of cancellation rate)
 *   15% account tenure (months on GigCredit / platforms)
 */
function calculateGigScore({ platforms = [], accountAgeMonths = 1 }) {
  if (!platforms.length) {
    return {
      score: 300,
      breakdown: { earningsScore: 0, ratingScore: 0, reliabilityScore: 0, tenureScore: 0 },
      riskTier: 'High Risk',
    };
  }

  const totalMonthlyEarnings = platforms.reduce((sum, p) => sum + (p.monthlyEarnings || 0), 0);
  const avgRating = platforms.reduce((sum, p) => sum + (p.rating || 0), 0) / platforms.length;
  const avgCancellationRate = platforms.reduce((sum, p) => sum + (p.cancellationRate || 0), 0) / platforms.length;
  const totalCompletedJobs = platforms.reduce((sum, p) => sum + (p.completedJobs || 0), 0);

  // Normalize each factor to 0-1
  const earningsFactor = Math.min(totalMonthlyEarnings / 4000, 1); // $4000/mo = max
  const ratingFactor = Math.min(Math.max(avgRating - 3, 0) / 2, 1); // 3.0-5.0 -> 0-1
  const reliabilityFactor = Math.min(Math.max(1 - avgCancellationRate / 15, 0), 1); // 0-15% cancellation
  const tenureFactor = Math.min(accountAgeMonths / 24, 1); // 24 months = max
  const jobsBonusFactor = Math.min(totalCompletedJobs / 1000, 1); // folded into reliability slightly

  const earningsScore = earningsFactor * 0.4;
  const ratingScore = ratingFactor * 0.25;
  const reliabilityScore = (reliabilityFactor * 0.8 + jobsBonusFactor * 0.2) * 0.2;
  const tenureScore = tenureFactor * 0.15;

  const weightedTotal = earningsScore + ratingScore + reliabilityScore + tenureScore; // 0-1
  const score = Math.round(300 + weightedTotal * 600); // 300-900

  let riskTier = 'High Risk';
  if (score >= 750) riskTier = 'Low Risk';
  else if (score >= 600) riskTier = 'Medium Risk';

  return {
    score: Math.min(Math.max(score, 300), 900),
    breakdown: {
      earningsScore: Math.round(earningsScore * 600),
      ratingScore: Math.round(ratingScore * 600),
      reliabilityScore: Math.round(reliabilityScore * 600),
      tenureScore: Math.round(tenureScore * 600),
    },
    riskTier,
  };
}

/** Rough monthly income eligible for lending purposes = sum of connected platform earnings */
function calculateMonthlyIncome(platforms = []) {
  return Math.round(platforms.reduce((sum, p) => sum + (p.monthlyEarnings || 0), 0));
}

/** Simple eligibility rule: higher score + income unlocks a bigger credit line */
function calculateLoanEligibility(score, monthlyIncome) {
  const scoreMultiplier = Math.max((score - 300) / 600, 0); // 0-1
  const base = monthlyIncome * 3; // up to 3x monthly income
  const eligible = Math.round((base * (0.4 + scoreMultiplier * 0.6)) / 100) * 100;
  return Math.min(Math.max(eligible, 500), 25000);
}

module.exports = { calculateGigScore, calculateMonthlyIncome, calculateLoanEligibility };
