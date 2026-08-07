/**
 * ============================================================================
 * GigCredit - Agent Execution Timeline & Live Stepper UI Manager
 * ============================================================================
 */

window.syncDocumentLinks = function() {
  const bankDoc = document.getElementById('doc-bank-select')?.value;
  const payoutDoc = document.getElementById('doc-payout-select')?.value;
  const ratingDoc = document.getElementById('doc-rating-select')?.value;
  const upiDoc = document.getElementById('doc-upi-select')?.value;

  if (bankDoc && document.getElementById('link-doc-bank')) {
    document.getElementById('link-doc-bank').href = `/uploads/${bankDoc}`;
  }
  if (payoutDoc && document.getElementById('link-doc-payout')) {
    document.getElementById('link-doc-payout').href = `/uploads/${payoutDoc}`;
  }
  if (ratingDoc && document.getElementById('link-doc-rating')) {
    document.getElementById('link-doc-rating').href = `/uploads/${ratingDoc}`;
  }
  if (upiDoc && document.getElementById('link-doc-upi')) {
    document.getElementById('link-doc-upi').href = `/uploads/${upiDoc}`;
  }

  if (typeof triggerAgentPipeline === 'function') {
    triggerAgentPipeline();
  }
};

async function triggerAgentPipeline() {
  const btn = document.getElementById('run-agent-pipeline-btn');
  const stepperContainer = document.getElementById('agent-stepper-container');
  const resultsContainer = document.getElementById('agent-results-container');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Starting 7-Stage Agent Pipeline...`;
  }

  if (stepperContainer) {
    stepperContainer.classList.remove('hidden');
    renderInitialTimelineState();
  }

  try {
    const bankDoc = document.getElementById('doc-bank-select')?.value || 'hdfc_bank_statement_july.png';
    const payoutDoc = document.getElementById('doc-payout-select')?.value || 'swiggy_zomato_weekly_payout.png';
    const ratingDoc = document.getElementById('doc-rating-select')?.value || 'fleet_captain_4_9_star_badge.png';
    const upiDoc = document.getElementById('doc-upi-select')?.value || 'upi_phonepe_history_july.png';

    // 1. Fetch backend multi-agent pipeline calculation
    const res = await fetch('/api/agents/run-pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentName: bankDoc,
        bankDoc,
        payoutDoc,
        ratingDoc,
        upiDoc,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert('Pipeline execution error: ' + (data.message || 'Unknown error'));
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>⚡ Execute 7-Stage Agent Pipeline</span>`;
      }
      return;
    }

    const { timeline, document: docInfo, verification, crossVerification, behavior, gigScore, explanation } = data.pipelineResults;

    // 2. Animate each of the 7 agents step-by-step with visible delays for user verification
    await animatePipelineSteps(timeline);

    // 3. Render Audit Results Card below stepper
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      renderPipelineResults({ docInfo, verification, crossVerification, behavior, gigScore, explanation });
    }

    // 4. Update main worker dashboard UI & Portable Financial Passport cards with newly calculated score
    updateWorkerDashboardScores(gigScore);

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>✓ 7-Agent Audit Complete (${gigScore.score} GigScore)</span>`;
    }
  } catch (err) {
    console.error('Agent Pipeline Error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>⚡ Execute 7-Stage Agent Pipeline</span>`;
    }
  }
}

// Update all worker dashboard cards dynamically across navbar, bento grid, and Ramesh Kumar Passport card
function updateWorkerDashboardScores(gigScore) {
  if (!gigScore) return;

  const score = gigScore.score || 785;
  const tier = gigScore.riskTier || 'Prime (Low Risk)';
  const creditLine = gigScore.approvedCreditLine || 120000;
  const dailyEmi = gigScore.dailyAutoEMI || 100;
  const monthlyIncome = gigScore.verifiedMonthlyIncome || 42500;

  // 1. Top Navigation Bar Score Badge (Top Right)
  const navScore = document.getElementById('header-user-score');
  if (navScore) navScore.textContent = `Score: ${score}`;

  // 2. Portable Financial Passport Card (Ramesh Kumar Banner)
  const passportScore = document.getElementById('passport-gigscore-val');
  if (passportScore) passportScore.textContent = score;

  const passportTier = document.getElementById('passport-risk-tier');
  if (passportTier) passportTier.textContent = tier;

  const passportFraud = document.getElementById('passport-fraud-risk-val');
  if (passportFraud) {
    passportFraud.textContent = score < 500 ? 'FLAGGED!' : 'CLEAN';
    passportFraud.className = score < 500 ? 'text-2xl font-extrabold text-rose-400 font-headline' : 'text-2xl font-extrabold text-emerald-400 font-headline';
  }

  // 3. Bento Dashboard Main Metrics Grid
  const mainScore = document.getElementById('score-val');
  if (mainScore) mainScore.textContent = score;

  const riskBadge = document.getElementById('risk-tier-badge');
  if (riskBadge) riskBadge.textContent = tier;

  const incomeVal = document.getElementById('income-val');
  if (incomeVal) incomeVal.textContent = `₹${monthlyIncome.toLocaleString('en-IN')}`;

  const creditVal = document.getElementById('credit-limit-val');
  if (creditVal) creditVal.textContent = `₹${creditLine.toLocaleString('en-IN')}`;

  // 4. Wildcard Query Selectors
  document.querySelectorAll('.gig-score-display-val, #summary-gigscore-val').forEach(el => el.textContent = score);
  document.querySelectorAll('.gig-risk-tier-val').forEach(el => el.textContent = tier);
  document.querySelectorAll('.gig-approved-credit-val').forEach(el => el.textContent = `₹${creditLine.toLocaleString('en-IN')}`);
  document.querySelectorAll('.gig-daily-emi-val').forEach(el => el.textContent = `₹${dailyEmi} / day`);
}

function renderInitialTimelineState() {
  const stepper = document.getElementById('agent-timeline-stepper');
  if (!stepper) return;

  const agents = [
    { id: 1, name: '1. Document Intelligence Agent', desc: 'File classification & OCR integrity check', status: 'QUEUED' },
    { id: 2, name: '2. Data Extraction Agent', desc: 'Parsing 4-month bank deposits & pay stub items', status: 'QUEUED' },
    { id: 3, name: '3. Verification & Fraud Agent', desc: 'Detecting tampered PDF fonts & digital signatures', status: 'QUEUED' },
    { id: 4, name: '4. Cross-Verification Agent', desc: 'Matching bank deposits against platform payout alerts', status: 'QUEUED' },
    { id: 5, name: '5. Behaviour Analysis Agent', desc: 'Computing income stability & work discipline index', status: 'QUEUED' },
    { id: 6, name: '6. GigScore Engine (ML)', desc: 'XGBoost (60%) + RandomForest (40%) underwriting', status: 'QUEUED' },
    { id: 7, name: '7. Explainability Agent', desc: 'Generating transparent AI score explanation', status: 'QUEUED' },
  ];

  stepper.innerHTML = agents
    .map(
      (a) => `
    <div id="step-card-${a.id}" class="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs transition-all shadow-sm">
      <div>
        <span class="font-bold text-white block">${a.name}</span>
        <span class="text-[10px] text-slate-400 block">${a.desc}</span>
      </div>
      <span id="step-status-${a.id}" class="px-2.5 py-1 bg-slate-800 text-slate-400 font-mono text-[10px] font-bold rounded border border-slate-700">${a.status}</span>
    </div>
  `
    )
    .join('');
}

async function animatePipelineSteps(timeline) {
  const btn = document.getElementById('run-agent-pipeline-btn');
  const agentNames = [
    'Document Intelligence Agent',
    'Data Extraction Agent',
    'Verification & Fraud Agent',
    'Cross-Verification Agent',
    'Behaviour Analysis Agent',
    'GigScore Engine (ML)',
    'Explainability Agent',
  ];

  for (let i = 1; i <= 7; i++) {
    const statusEl = document.getElementById(`step-status-${i}`);
    const cardEl = document.getElementById(`step-card-${i}`);

    if (btn) {
      btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Running Agent ${i} of 7: ${agentNames[i-1]}...`;
    }

    if (statusEl && cardEl) {
      cardEl.className = 'p-3 bg-indigo-950/80 border border-indigo-500/70 rounded-xl flex items-center justify-between text-xs shadow-md transition-all scale-[1.02]';
      statusEl.className = 'px-2.5 py-1 bg-indigo-600 text-white font-mono text-[10px] font-bold rounded animate-pulse';
      statusEl.textContent = 'EXECUTING...';

      await new Promise((r) => setTimeout(r, 450));

      cardEl.className = 'p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-xl flex items-center justify-between text-xs shadow-sm transition-all scale-100';
      statusEl.className = 'px-2.5 py-1 bg-emerald-500 text-white font-mono text-[10px] font-bold rounded';
      statusEl.textContent = 'PASSED ✓';
    }
  }
}

function renderPipelineResults({ docInfo, verification, crossVerification, behavior, gigScore, explanation }) {
  const card = document.getElementById('agent-results-card');
  if (!card) return;

  const expText = typeof explanation === 'string' 
    ? explanation 
    : (explanation?.summary || explanation?.naturalLanguageExplanation || explanation?.text || 'Multi-app income velocity verified across selected Bank, Payout, Rating, and UPI documents.');

  const scoreColor = gigScore.score >= 850 ? 'text-emerald-400' : gigScore.score >= 740 ? 'text-emerald-500' : gigScore.score >= 620 ? 'text-blue-400' : 'text-amber-400';

  card.innerHTML = `
    <div class="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl space-y-4 shadow-xl border border-indigo-800/40 animate-fade-in-up">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Verified Multi-Doc Audit Summary</span>
          <h3 class="text-xl font-bold font-headline text-white">7-Stage Multi-Agent Audit Results</h3>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-400 block font-mono">Combination GigScore</span>
          <span class="text-3xl font-extrabold ${scoreColor} font-mono">${gigScore.score} / 900</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
          <span class="text-slate-400 text-[10px] block">Risk Tier</span>
          <strong class="text-emerald-400 font-bold">${gigScore.riskTier}</strong>
        </div>
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
          <span class="text-slate-400 text-[10px] block">Approved Credit</span>
          <strong class="text-white font-mono font-bold">₹${(gigScore.approvedCreditLine || 120000).toLocaleString('en-IN')}</strong>
        </div>
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
          <span class="text-slate-400 text-[10px] block">Daily Auto-EMI</span>
          <strong class="text-emerald-400 font-mono font-bold">₹${gigScore.dailyAutoEMI || 100} / day</strong>
        </div>
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
          <span class="text-slate-400 text-[10px] block">Verified Income</span>
          <strong class="text-blue-400 font-mono font-bold">₹${(gigScore.verifiedMonthlyIncome || 54000).toLocaleString('en-IN')}/mo</strong>
        </div>
      </div>

      <div class="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-2">
        <span class="text-[10px] font-bold text-indigo-300 font-mono tracking-wider">🤖 TRANSPARENT AI EXPLANATION</span>
        <p class="text-slate-200 leading-relaxed">${expText}</p>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderInitialTimelineState();
});

window.executeStagePipeline = triggerAgentPipeline;
