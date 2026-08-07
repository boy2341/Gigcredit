/**
 * ============================================================================
 * GigCredit - Multi-Agent Underwriting Engine Test
 * Reference Profile 2: Farhan Ali (Unity Trust Bank + SwiftEats + ZipMart)
 * ============================================================================
 */

const AgentOrchestrator = require('../agents/AgentOrchestrator');

async function evaluateFarhanAli() {
  console.log('🚀 Running 7-Stage Agent Underwriting for Farhan Ali Reference Data...\n');

  const inputData = {
    name: 'Farhan Ali',
    bankName: 'Unity Trust Bank',
    accountNumberMasked: 'XXXXXXXX3387',
    ifsc: 'UTBK0004417',
    statementPeriod: '01 Apr 2026 - 28 Apr 2026',
    selectedPlatforms: ['ZipMart', 'SwiftEats'],
    
    openingBalance: 42150.30,
    closingBalance: 68850.00,
    totalCreditsINR: 35155.12,
    totalDebitsINR: 8455.42,

    platformBreakdown: [
      {
        platform: 'ZipMart Payouts Pvt Ltd',
        monthlyEarnings: 20322.72,
        rating: 4.85,
        completedJobs: 410,
        cancellationRate: 0.4,
      },
      {
        platform: 'SwiftEats Payouts Pvt Ltd',
        monthlyEarnings: 14832.40,
        rating: 4.90,
        completedJobs: 320,
        cancellationRate: 0.6,
      },
    ],

    upiTransactions: [
      { refNo: '229836394225', amount: 3644, from: 'SwiftEats Payouts Pvt Ltd', date: '07 Apr 2026' },
      { refNo: '583295001674', amount: 4890, from: 'ZipMart Payouts Pvt Ltd', date: '09 Apr 2026' },
    ],
    
    ratingsAverage: 4.88,
    
    rawText: `
      UNITY TRUST BANK ACCOUNT STATEMENT
      Account Holder: Farhan Ali
      Account No.: XXXXXXXX3387 | IFSC: UTBK0004417
      Statement Period: 01 Apr 2026 - 28 Apr 2026
      Opening Balance: ₹42,150.30
      Total Credits: ₹35,155.12 | Total Debits: ₹8,455.42
      Closing Balance: ₹68,850.00
      2026-04-03: SwiftEats Payout CREDIT INR 3,800.17 | Balance: 45,950.47
      2026-04-05: ZipMart Payout CREDIT INR 5,096.47 | Balance: 51,046.94
      2026-04-08: Fuel Station DEBIT INR 708.67 | Balance: 50,338.27
      2026-04-10: SwiftEats Payout CREDIT INR 3,516.91 | Balance: 53,855.18
      2026-04-12: ZipMart Payout CREDIT INR 5,192.64 | Balance: 59,047.82
      2026-04-15: Fuel Station DEBIT INR 726.56 | Balance: 58,321.26
      2026-04-17: SwiftEats Payout CREDIT INR 3,512.32 | Balance: 61,833.58
      2026-04-18: Rent / Room Payment DEBIT INR 4,687.14 | Balance: 57,146.44
      2026-04-19: ZipMart Payout CREDIT INR 4,912.40 | Balance: 62,058.84
      2026-04-22: Fuel Station DEBIT INR 748.74 | Balance: 61,310.10
      2026-04-23: UPI Transfer - Groceries DEBIT INR 844.94 | Balance: 60,465.16
      2026-04-24: SwiftEats Payout CREDIT INR 4,003.00 | Balance: 64,468.16
      2026-04-26: ZipMart Payout CREDIT INR 5,121.21 | Balance: 69,589.37
      2026-04-29: Fuel Station DEBIT INR 739.37 | Balance: 68,850.00
    `,
  };

  const context = await AgentOrchestrator.runPipeline(inputData);

  console.log('\n======================================================');
  console.log('🎯 UNDERWRITING RESULT FOR FARHAN ALI');
  console.log('======================================================');
  console.log(`👤 Name: ${context.worker.name}`);
  console.log(`🏦 Bank: ${context.extraction.bankName} (${context.extraction.accountNumberMasked})`);
  console.log(`💰 Verified Monthly Income: ₹${context.extraction.extractedMonthlyEarnings.toLocaleString('en-IN')}`);
  console.log(`📊 Income Stability Index: ${context.behavior.incomeStabilityIndex} / 100`);
  console.log(`🔍 Fraud Audit Status: ${context.verification.tamperFlags.length === 0 ? 'CLEAN (0 Tamper Flags)' : 'FLAGGED'}`);
  console.log(`🔗 Data Confidence Score: ${context.crossVerification.dataConfidenceScore}%`);
  console.log(`⭐ Average Rider Rating: ${context.behavior.ratingAverage} ⭐ (ZipMart 4.85 + SwiftEats 4.90)`);
  console.log(`🧠 GIGCREDIT SCORE: ${context.gigScore.score} / 900`);
  console.log(`🏷️ Risk Tier: ${context.gigScore.riskTier}`);
  console.log(`💳 Pre-Approved Credit Limit: ₹${context.gigScore.approvedCreditLine.toLocaleString('en-IN')}`);
  console.log(`💸 Daily Escrow Auto-EMI: ₹${context.gigScore.dailyAutoEMI} / day`);
  console.log('\n🗣️ Hinglish AI Summary:');
  console.log(context.explanation.hinglishSummary);
  console.log('======================================================\n');
}

evaluateFarhanAli().catch(console.error);
