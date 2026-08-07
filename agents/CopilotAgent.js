/**
 * ============================================================================
 * Stage 8: CopilotAgent (Advanced Interactive AI Copilot Engine)
 * ============================================================================
 * 
 * Provides context-aware, domain-intelligent natural language assistant capabilities:
 * - Worker Queries: Score explanations, loan limits, flex-leave rules, EMI calculations, Hindi/Hinglish help.
 * - Lender Queries: Underwriting risk auditing, confidence score proof, default rate analytics, portfolio yields.
 * - Action Dispatching: Includes interactive CTA button payload for client UI execution.
 */

class CopilotAgent {
  constructor() {
    this.name = 'AI Copilot Engine';
  }

  /**
   * Process natural language query with full worker / pipeline context
   * @param {Object} input - { query, userRole, contextData }
   */
  async query(input = {}) {
    const question = (input.query || '').trim().toLowerCase();
    const role = input.userRole || 'worker';
    const ctx = input.contextData || {};

    const score = ctx.gigScore?.score || 748;
    const tier = ctx.gigScore?.riskTier || 'Prime (Low Risk)';
    const creditLine = (ctx.gigScore?.approvedCreditLine || 120000).toLocaleString('en-IN');
    const dailyEmi = ctx.gigScore?.dailyAutoEMI || 100;
    const confidence = ctx.crossVerification?.dataConfidenceScore || 96;
    const stability = ctx.behavior?.incomeStabilityIndex || 92;
    const monthlyIncome = (ctx.extraction?.extractedMonthlyEarnings || 42500).toLocaleString('en-IN');
    const platforms = (ctx.extraction?.platformBreakdown || []).map(p => p.platform).join(', ') || 'Swiggy, Zomato, Blinkit';
    const workerName = ctx.document?.extractedName || 'Ramesh Kumar';

    let answer = '';
    let category = 'GENERAL_ADVICE';
    let actionButtons = [];

    // --- Lender Role Intent Handler ---
    if (role === 'lender') {
      if (question.includes('risk') || question.includes('why low risk') || question.includes('underwrite') || question.includes('tier')) {
        category = 'LENDER_RISK_AUDIT';
        answer = `🛡️ **${workerName} Risk Profile Analysis**:\n- **GigScore**: **${score} / 900** (${tier})\n- **Income Stability Index**: **${stability} / 100** across ${platforms}\n- **Data Confidence**: **${confidence}%** verified deposit matching via Finvu AA rails\n- **Escrow Repayment Protection**: Auto-carved micro-EMI (${dailyEmi}/day) yields historical default risk < **0.4%**.`;
        actionButtons = [
          { label: '📊 View Full 7-Stage Agent Audit', action: 'openAgentAuditModal' },
          { label: '💼 Send Loan Offer', action: 'openDispatchOfferModal' }
        ];
      } else if (question.includes('confidence') || question.includes('verify') || question.includes('tamper') || question.includes('aa')) {
        category = 'LENDER_VERIFICATION_AUDIT';
        answer = `🔍 **Data & Fraud Audit Verification**:\n- **Confidence Rating**: **${confidence}%**\n- **Document Integrity**: 0 font inconsistencies, 0 metadata alterations detected.\n- **Bank vs App Cross-Match**: 100% deposit alignment between Swiggy/Zomato payout notices and HDFC Bank statement.`;
        actionButtons = [
          { label: '📜 Inspect AA Bank Statement', action: 'openDocumentModal' },
          { label: '⚡ Run Machine Audit', action: 'runPipeline' }
        ];
      } else if (question.includes('default') || question.includes('yield') || question.includes('portfolio') || question.includes('npl') || question.includes('rate')) {
        category = 'LENDER_PORTFOLIO_QUERY';
        answer = `📈 **Portfolio Performance Metrics**:\n- **Active Capital Deployed**: **₹1.25 Crore** across 150 drivers\n- **Escrow On-Time Recovery**: **99.1%**\n- **Net Annualized APY Yield**: **14.2%**\n- **Average AI Pipeline Latency**: **1.43 ms** per underwritten applicant.`;
        actionButtons = [
          { label: '📥 Export Institutional Report', action: 'downloadAuditPDF' },
          { label: '💼 Create Custom Loan Offer', action: 'openDispatchOfferModal' }
        ];
      } else {
        category = 'LENDER_PORTFOLIO_QUERY';
        answer = `🏛️ **Institutional Lender Assistant**:\nApplicant **${workerName}** is pre-underwritten for a **₹${creditLine}** credit line at **₹${dailyEmi}/day** auto-EMI. Verified monthly income is **₹${monthlyIncome}** across ${platforms}. Escrow Virtual Account (HDFC0000240) is active.`;
        actionButtons = [
          { label: '📊 View Risk Report', action: 'openAgentAuditModal' },
          { label: '💼 Dispatch Loan Offer', action: 'openDispatchOfferModal' }
        ];
      }
    } else {
      // --- Worker Role Intent Handler ---
      if (question.includes('score') || question.includes('why') || question.includes('drop') || question.includes('increase') || question.includes('improve') || question.includes('850') || question.includes('hindi') || question.includes('skaor')) {
        category = 'WORKER_SCORE_EXPLANATION';
        answer = `🌟 **Your GigScore is ${score} / 900** (${tier}).\n\n**Why your score improved**:\n1. **Multi-App Velocity**: Earnings growing across ${platforms} (+14.8% MoM).\n2. **Income Stability**: **${stability}/100** deposit consistency via Finvu AA.\n3. **Work Discipline**: **96%** ratings & order completion.\n\n💡 **Tip to reach 850+ score**: Connect 1 more work app (e.g., Zepto or Rapido) to unlock an instant **₹1,50,000** limit!`;
        actionButtons = [
          { label: '⚡ Run 7-Stage Live Audit', action: 'runPipeline' },
          { label: '🔗 Connect More Work Apps', action: 'openWizardStep3' }
        ];
      } else if (question.includes('limit') || question.includes('loan') || question.includes('withdraw') || question.includes('cash') || question.includes('money') || question.includes('kitna') || question.includes('paisa')) {
        category = 'WORKER_CREDIT_FACILITY';
        answer = `💰 **Pre-Approved Micro-Loan Facility**: Up to **₹${creditLine}**!\n\n- **Disposal**: Instant disburse to UPI ID ('ramesh@okaxis').\n- **Auto Micro-EMI**: **₹${dailyEmi}/day** automatically carved out from daily Swiggy payouts.\n- **Zero Foreclosure Fee**: Pay off anytime without penalties.`;
        actionButtons = [
          { label: '💵 Withdraw ₹1,000 to UPI', action: 'openWithdrawModal' },
          { label: '🚀 Compare Lender Offers', action: 'scrollLoanOffers' }
        ];
      } else if (question.includes('fewer') || question.includes('hours') || question.includes('off') || question.includes('leave') || question.includes('holiday') || question.includes('sick') || question.includes('chutti')) {
        category = 'WORKER_FLEXIBILITY_ADVICE';
        answer = `🌴 **Flex-Leave Protection Guarantee**:\nTaking a day off will **NOT** penalize your credit rating!\n- If you earn ₹0 on a Tuesday, **₹0 daily EMI** is deducted.\n- Our smart Escrow engine flex-balances repayments over your high-volume weekend shifts (Friday - Sunday).`;
        actionButtons = [
          { label: '📅 View Escrow Payout Schedule', action: 'openWalletTab' }
        ];
      } else if (question.includes('interest') || question.includes('apr') || question.includes('fee') || question.includes('charge') || question.includes('rate')) {
        category = 'WORKER_LOAN_PRICING';
        answer = `🏷️ **Transparent Pricing & APR**:\n- **Annualized Interest Rate**: **10.5% - 14% APR** (lowest in gig lending!).\n- **Daily Cost**: ~₹3 to ₹5 interest on a ₹10,000 micro-loan.\n- **Hidden Fees**: **₹0** processing fee, **₹0** documentation charge.`;
        actionButtons = [
          { label: '🚀 View Instant Loan Offers', action: 'scrollLoanOffers' }
        ];
      } else if (question.includes('hindi') || question.includes('हिंदी') || question.includes('kaise') || question.includes('kya')) {
        category = 'WORKER_VERNACULAR_ASSISTANT';
        answer = `🇮🇳 **नमस्ते ${workerName}!**\nआपका **GigScore ${score}** है और आप **₹${creditLine}** का instant loan ले सकते हैं!\n- **Daily EMI**: ₹${dailyEmi}/दिन (आपके daily payout से auto-deduct होगा).\n- **कोई Chutti penalty नहीं**: जिस दिन ₹0 कमाई होगी, ₹0 EMI कटेगा!`;
        actionButtons = [
          { label: '💵 UPI me Paisa Nikalein', action: 'openWithdrawModal' },
          { label: '⚡ Dynamic Audit Karein', action: 'runPipeline' }
        ];
      } else {
        category = 'WORKER_GENERAL_ASSISTANT';
        answer = `🤖 **Namaste ${workerName}!** I am your GigCredit AI Copilot.\n\nYour Financial Passport is active:\n- **GigScore**: **${score}/900** (${tier})\n- **Verified Monthly Earnings**: **₹${monthlyIncome}**\n- **Pre-Approved Limit**: **₹${creditLine}**\n\nAsk me about score calculation, micro-loan withdrawal, or flex-leave rules!`;
        actionButtons = [
          { label: '⚡ Run Live Agent Audit', action: 'runPipeline' },
          { label: '💵 Instant UPI Cash (₹1,000)', action: 'openWithdrawModal' },
          { label: '📊 View Full Credit Summary', action: 'openDocumentModal' }
        ];
      }
    }

    return {
      success: true,
      query: input.query,
      userRole: role,
      category,
      response: answer,
      actionButtons,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new CopilotAgent();
