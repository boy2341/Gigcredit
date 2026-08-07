const GigScoreEngine = require('../agents/GigScoreEngine');
const PipelineContext = require('../agents/PipelineContext');

async function testCombinations() {
  console.log('--- TESTING MULTI-SCORE UNDERWRITING SPECTRUM (320 to 885) ---');

  const testCases = [
    { name: 'VIP Super Prime', bankDoc: 'hdfc_bank_statement_july.png', payoutDoc: 'gurpreet_express_freight_log.png', ratingDoc: 'fleet_captain_4_9_star_badge.png', upiDoc: 'bhim_escrow_direct_log.png' },
    { name: 'Prime Low Risk', bankDoc: 'sbi_scanned_bank_statement.png', payoutDoc: 'swiggy_zomato_weekly_payout.png', ratingDoc: 'zomato_gold_badge_rating.png', upiDoc: 'upi_phonepe_history_july.png' },
    { name: 'Medium Standard', bankDoc: 'unity_trust_bank_farhan.png', payoutDoc: 'uber_ola_earnings_summary.png', ratingDoc: 'shadowfax_silver_captain.png', upiDoc: 'amazon_pay_cashflow_log.png' },
    { name: 'Low Income High Risk (₹9.5k/mo)', bankDoc: 'starter_cashflow_statement.png', payoutDoc: 'unverified_solo_paystub.png', ratingDoc: 'unrated_starter_badge.png', upiDoc: 'high_outflow_upi_log.png' },
    { name: 'Tampered PDF Fraud Flag', bankDoc: 'edited_tampered_statement.png', payoutDoc: 'swiggy_zomato_weekly_payout.png', ratingDoc: 'fleet_captain_4_9_star_badge.png', upiDoc: 'upi_phonepe_history_july.png' },
  ];

  for (const tc of testCases) {
    const ctx = new PipelineContext({
      bankDoc: tc.bankDoc,
      payoutDoc: tc.payoutDoc,
      ratingDoc: tc.ratingDoc,
      upiDoc: tc.upiDoc,
    });

    await GigScoreEngine.run(ctx);
    const res = ctx.gigScore;
    console.log(`[${tc.name}] -> GigScore: ${res.score}/900 | Risk Tier: ${res.riskTier} | Monthly Inc: ₹${res.verifiedMonthlyIncome.toLocaleString('en-IN')}/mo | Credit: ₹${res.approvedCreditLine.toLocaleString('en-IN')}`);
  }
}

testCombinations();
