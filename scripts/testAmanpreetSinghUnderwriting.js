/**
 * ============================================================================
 * GigCredit - Multi-Agent Underwriting Engine Test
 * Reference Profile: Amanpreet Singh (Unity Trust Bank + SwiftEats + ZipMart)
 * ============================================================================
 */

const AgentOrchestrator = require('../agents/AgentOrchestrator');

async function evaluateAmanpreetSingh() {
  console.log('🚀 Running 7-Stage Agent Underwriting for Amanpreet Singh Reference Data...\n');

  // Input context built directly from the uploaded reference document images
  const inputData = {
    name: 'Amanpreet Singh',
    bankName: 'Unity Trust Bank',
    accountNumberMasked: 'XXXXXXXX6621',
    ifsc: 'UTBK0009981',
    statementPeriod: '01 Apr 2026 - 28 Apr 2026',
    selectedPlatforms: ['SwiftEats', 'ZipMart'],
    
    // Exact Financial Metrics from Images
    openingBalance: 42150.30,
    closingBalance: 50790.84,
    totalCreditsINR: 21303.00,
    totalDebitsINR: 12662.46,

    // Platform Income Breakdown (SwiftEats: ₹7,748.11 | ZipMart: ₹13,554.89)
    platformBreakdown: [
      {
        platform: 'ZipMart Payouts Pvt Ltd',
        monthlyEarnings: 13554.89,
        rating: 4.10,
        completedJobs: 285,
        cancellationRate: 1.2,
      },
      {
        platform: 'SwiftEats Payouts Pvt Ltd',
        monthlyEarnings: 7748.11,
        rating: 4.40,
        completedJobs: 172,
        cancellationRate: 1.8,
      },
    ],

    // UPI Transaction References & Ratings
    upiTransactions: [
      { refNo: '525808631930', amount: 1924, from: 'SwiftEats Payouts Pvt Ltd', date: '07 Apr 2026' },
      { refNo: '868759358685', amount: 3386, from: 'ZipMart Payouts Pvt Ltd', date: '09 Apr 2026' },
    ],
    
    // Ratings: (4.4 + 4.1) / 2 = 4.25 ⭐ average rating
    ratingsAverage: 4.25,
    
    // Raw Bank Statement Text for Regex Parser & Fraud Audit
    rawText: `
      UNITY TRUST BANK ACCOUNT STATEMENT
      Account Holder: Amanpreet Singh
      Account No.: XXXXXXXX6621 | IFSC: UTBK0009981
      Statement Period: 01 Apr 2026 - 28 Apr 2026
      Opening Balance: ₹42,150.30
      Total Credits: ₹21,303.00 | Total Debits: ₹12,662.46
      Closing Balance: ₹50,790.84
      2026-04-03: SwiftEats Payout CREDIT INR 1,938.14 | Balance: 44,088.44
      2026-04-05: ZipMart Payout CREDIT INR 3,260.04 | Balance: 47,348.48
      2026-04-08: Fuel Station DEBIT INR 824.56 | Balance: 46,523.92
      2026-04-10: SwiftEats Payout CREDIT INR 1,827.60 | Balance: 48,351.52
      2026-04-12: ZipMart Payout CREDIT INR 3,371.93 | Balance: 51,723.45
      2026-04-13: Vehicle EMI DEBIT INR 4,292.00 | Balance: 47,431.45
      2026-04-15: Fuel Station DEBIT INR 758.87 | Balance: 46,672.58
      2026-04-17: SwiftEats Payout CREDIT INR 1,967.57 | Balance: 48,640.15
      2026-04-18: Rent / Room Payment DEBIT INR 4,079.61 | Balance: 44,560.54
      2026-04-19: ZipMart Payout CREDIT INR 3,627.92 | Balance: 48,188.46
      2026-04-22: Fuel Station DEBIT INR 790.51 | Balance: 47,397.95
      2026-04-23: UPI Transfer - Groceries DEBIT INR 1,078.37 | Balance: 46,319.58
      2026-04-24: SwiftEats Payout CREDIT INR 2,014.80 | Balance: 48,334.38
      2026-04-26: ZipMart Payout CREDIT INR 3,295.00 | Balance: 51,629.38
      2026-04-29: Fuel Station DEBIT INR 838.54 | Balance: 50,790.84
    `,
  };

  const context = await AgentOrchestrator.runPipeline(inputData);

  console.log('\n======================================================');
  console.log('🎯 UNDERWRITING RESULT FOR AMANPREET SINGH');
  console.log('======================================================');
  console.log(`👤 Name: ${context.worker.name}`);
  console.log(`🏦 Bank: ${context.extraction.bankName} (${context.extraction.accountNumberMasked})`);
  console.log(`💰 Verified Monthly Income: ₹${context.extraction.extractedMonthlyEarnings.toLocaleString('en-IN')}`);
  console.log(`📊 Income Stability Index: ${context.behavior.incomeStabilityIndex} / 100`);
  console.log(`🔍 Fraud Audit Status: ${context.verification.tamperFlags.length === 0 ? 'CLEAN (0 Tamper Flags)' : 'FLAGGED'}`);
  console.log(`🔗 Data Confidence Score: ${context.crossVerification.dataConfidenceScore}%`);
  console.log(`⭐ Average Rider Rating: ${context.behavior.ratingAverage} ⭐ (SwiftEats 4.4 + ZipMart 4.1)`);
  console.log(`🧠 GIGCREDIT SCORE: ${context.gigScore.score} / 900`);
  console.log(`🏷️ Risk Tier: ${context.gigScore.riskTier}`);
  console.log(`💳 Pre-Approved Credit Limit: ₹${context.gigScore.approvedCreditLine.toLocaleString('en-IN')}`);
  console.log(`💸 Daily Escrow Auto-EMI: ₹${context.gigScore.dailyAutoEMI} / day`);
  console.log('\n🗣️ Hinglish AI Summary:');
  console.log(context.explanation.hinglishSummary);
  console.log('======================================================\n');
}

evaluateAmanpreetSingh().catch(console.error);
