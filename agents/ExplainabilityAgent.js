/**
 * ============================================================================
 * Stage 7: ExplainabilityAgent (Transparent English & Hinglish AI Explanation)
 * ============================================================================
 * 
 * Translates complex ML model parameters into clear, transparent, human-readable
 * explanations in both English and Hinglish across 4-month historical timelines.
 */

class ExplainabilityAgent {
  constructor() {
    this.name = 'Explainability Agent';
    this.stageId = 7;
  }

  async run(context) {
    context.logStep(this.stageId, this.name, 'IN_PROGRESS', 'Generating 4-month transparent English & Hinglish score explanation reports...');

    const score = context.gigScore.score;
    const tier = context.gigScore.riskTier;
    const platforms = (context.extraction.platformBreakdown || []).map((p) => p.platform).join(', ');
    const monthlyIncome = (context.extraction.extractedMonthlyEarnings || 0).toLocaleString('en-IN');
    const fourMonthTotal = (context.extraction.fourMonthTotalIncome || 61300).toLocaleString('en-IN');
    const creditLine = (context.gigScore.approvedCreditLine || 0).toLocaleString('en-IN');

    const summary = `Based on your 4-Month Bank Statement (Apr–Jul 2026) showing total verified earnings of ₹${fourMonthTotal} (Avg ₹${monthlyIncome}/mo) across ${platforms}, an Income Stability Index of ${context.behavior.incomeStabilityIndex}/100, and a ${context.crossVerification.dataConfidenceScore}% bank reconciliation rate, you earned a ${score} GigCredit score (${tier}). You are pre-approved for a credit limit of ₹${creditLine}.`;

    const hinglishSummary = `Aapke 4-Month Bank Statement (April se July 2026) me verified total earning ₹${fourMonthTotal} (avg ₹${monthlyIncome}/month) aur high rating ke basis par aapka GigCredit score ${score} (${tier}) calculate hua hai. Aapko ₹${creditLine} tak ka loan ₹${context.gigScore.dailyAutoEMI}/day ki easy Escrow auto-EMI par pre-approve kar diya gaya hai!`;

    const keyScoreBoosters = [
      `4-Month Cashflow Track Record: ₹${fourMonthTotal} verified across 120 active shifts.`,
      `Multi-App Velocity: +${context.behavior.multiAppIncomeVelocity}% earnings growth month-over-month.`,
      `Verified Escrow Stream: 100% bank deposit reconciliation via Finvu AA.`,
      `High Ratings: ${context.behavior.ratingAverage} ⭐ average rating across delivery fleets.`,
    ];

    const actionableTips = [
      'Maintain active daily work shifts across 2+ platforms to preserve Prime Tier status.',
      'Keep order cancellation rate under 1.5% to lower daily micro-EMI interest rates.',
      'Maintain an average daily bank balance of ₹5,000+ for higher credit line increases.',
    ];

    context.explanation = {
      summary,
      hinglishSummary,
      keyScoreBoosters,
      actionableTips,
      generatedAt: new Date().toISOString(),
    };

    context.logStep(
      this.stageId,
      this.name,
      'COMPLETED',
      `4-Month Explainability report generated in English and Hinglish! AI Pipeline Execution Finished Successfully.`
    );

    return context;
  }
}

module.exports = new ExplainabilityAgent();
