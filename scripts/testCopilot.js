/**
 * ============================================================================
 * GigCredit - AI Copilot Automated Test Script
 * ============================================================================
 */

const CopilotAgent = require('../agents/CopilotAgent');
const AgentOrchestrator = require('../agents/AgentOrchestrator');

async function testCopilot() {
  console.log('🤖 Testing AI Copilot Engine...\n');

  const context = await AgentOrchestrator.runPipeline({
    name: 'Ramesh Kumar',
    selectedPlatforms: ['Swiggy', 'Zomato', 'Blinkit'],
  });

  // Test 1: Worker Question
  const workerRes = await CopilotAgent.query({
    query: 'Why did my score improve?',
    userRole: 'worker',
    contextData: context,
  });

  console.log('💬 Worker Query: "Why did my score improve?"');
  console.log('🤖 AI Response:', workerRes.response, '\n');

  // Test 2: Lender Question
  const lenderRes = await CopilotAgent.query({
    query: 'Why is Ramesh Kumar low risk?',
    userRole: 'lender',
    contextData: context,
  });

  console.log('💬 Lender Query: "Why is Ramesh Kumar low risk?"');
  console.log('🤖 AI Response:', lenderRes.response, '\n');

  if (workerRes.response && lenderRes.response) {
    console.log('✅ AI COPILOT ENGINE TEST PASSED SUCCESSFULLY!');
  }
}

testCopilot().catch(err => {
  console.error('❌ Copilot Test Error:', err);
  process.exit(1);
});
