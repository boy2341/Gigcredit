/**
 * ============================================================================
 * GigCredit - AgentOrchestrator (Central Multi-Agent Coordinator)
 * ============================================================================
 * 
 * Orchestrates the sequential execution of all 7 agents in the agentic workflow:
 * 1. DocumentIntelligenceAgent (File Classification)
 * 2. ExtractionAgent (Data Parsing)
 * 3. VerificationFraudAgent (Authenticity Audit)
 * 4. CrossVerificationAgent (Bank vs Platform Matching)
 * 5. BehaviourAnalysisAgent (Behavioral Analytics)
 * 6. GigScoreEngine (ML Ensemble Underwriting)
 * 7. ExplainabilityAgent (Transparent AI Explanations)
 */

const PipelineContext = require('./PipelineContext');
const DocumentIntelligenceAgent = require('./DocumentIntelligenceAgent');
const ExtractionAgent = require('./ExtractionAgent');
const VerificationFraudAgent = require('./VerificationFraudAgent');
const CrossVerificationAgent = require('./CrossVerificationAgent');
const BehaviourAnalysisAgent = require('./BehaviourAnalysisAgent');
const GigScoreEngine = require('./GigScoreEngine');
const ExplainabilityAgent = require('./ExplainabilityAgent');

class AgentOrchestrator {
  constructor() {
    this.agents = [
      DocumentIntelligenceAgent,
      ExtractionAgent,
      VerificationFraudAgent,
      CrossVerificationAgent,
      BehaviourAnalysisAgent,
      GigScoreEngine,
      ExplainabilityAgent,
    ];
  }

  /**
   * Runs the complete 7-stage multi-agent pipeline
   * @param {Object} input - { name, phone, documentName, selectedPlatforms, smsSampleText, accountAgeMonths }
   * @returns {PipelineContext}
   */
  async runPipeline(input = {}) {
    const context = new PipelineContext(input);

    console.log(`\n======================================================`);
    console.log(`🚀 [AgentOrchestrator] Starting 7-Stage Agent Pipeline...`);
    console.log(`   Session ID: ${context.sessionId}`);
    console.log(`======================================================`);

    for (const agent of this.agents) {
      try {
        await agent.run(context);
      } catch (err) {
        console.error(`❌ Error in agent [${agent.name}]:`, err.message);
        context.logStep(agent.stageId || 0, agent.name || 'Agent', 'FAILED', err.message);
        break; // Halt on fatal failure
      }
    }

    console.log(`======================================================`);
    console.log(`✅ [AgentOrchestrator] Pipeline Finished Successfully!`);
    console.log(`   Final Score: ${context.gigScore.score} (${context.gigScore.riskTier})`);
    console.log(`======================================================\n`);

    return context;
  }
}

module.exports = new AgentOrchestrator();
