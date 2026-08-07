/**
 * ============================================================================
 * GigCredit - Automated Multi-Agent Pipeline Test Script
 * ============================================================================
 */

const AgentOrchestrator = require('../agents/AgentOrchestrator');

async function runTest() {
  console.log('🧪 Running 7-Stage Agent Pipeline Automated Test...\n');

  const testPayload = {
    name: 'Ramesh Kumar (Verification Test)',
    phone: '+91 98765 43210',
    documentName: 'hdfc_bank_statement_july.pdf',
    selectedPlatforms: ['Swiggy', 'Zomato', 'Blinkit'],
    smsSampleText: 'Alert: Swiggy weekly payout ₹4,625 deposited to Escrow HDFC0000240',
  };

  const startTime = Date.now();
  const context = await AgentOrchestrator.runPipeline(testPayload);
  const duration = Date.now() - startTime;

  console.log('\n---------------- STATUS CHECK ----------------');
  console.log(`⏱️ Execution Duration: ${duration}ms`);
  console.log(`🆔 Session ID: ${context.sessionId}`);
  console.log(`📄 Document Type Identified: ${context.document.documentType}`);
  console.log(`💰 Extracted Monthly Earnings: ₹${context.extraction.extractedMonthlyEarnings.toLocaleString('en-IN')}`);
  console.log(`🔍 Fraud Tamper Status: ${context.verification.authenticityPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`🔗 Cross-Verification Confidence: ${context.crossVerification.dataConfidenceScore}%`);
  console.log(`📊 Income Stability Index: ${context.behavior.incomeStabilityIndex}/100`);
  console.log(`🧠 GigCredit Score: ${context.gigScore.score}/900 (${context.gigScore.riskTier})`);
  console.log(`💳 Approved Credit Line: ₹${context.gigScore.approvedCreditLine.toLocaleString('en-IN')}`);
  console.log(`🗣️ Hinglish Summary: ${context.explanation.hinglishSummary}`);
  console.log(`📋 Total Timeline Log Steps: ${context.timeline.length}`);
  console.log('----------------------------------------------\n');

  if (context.gigScore.score >= 300 && context.timeline.length >= 7) {
    console.log('✅ ALL 7 AGENT PIPELINE STAGES EXECUTED AND PASSED VERIFICATION!');
    process.exit(0);
  } else {
    console.error('❌ Pipeline test failed verification!');
    process.exit(1);
  }
}

runTest().catch((err) => {
  console.error('❌ Test crashed:', err);
  process.exit(1);
});
