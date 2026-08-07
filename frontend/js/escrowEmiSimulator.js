/**
 * ============================================================================
 * GigCredit - Escrow Dynamic Daily Micro-EMI Cutoff Simulator & Calculator
 * ============================================================================
 * 
 * Implements the proprietary GigCredit Escrow Cutoff Protocol:
 * 1. Dynamic Daily EMI Cutoff = Min(MaxCap, Round(DailyEarnings * CutoffPercentage))
 * 2. Flex-Leave Protection Rule: If DailyEarnings == 0, DailyEMI = ₹0 (Zero Penalty Guarantee)
 */

function calculateEmiCutoff(earnings, ratePct = 7, cap = 150) {
  const numericEarnings = Math.max(0, Number(earnings) || 0);
  if (numericEarnings === 0) {
    return {
      dailyEarnings: 0,
      emiCutoff: 0,
      netBankPayout: 0,
      isFlexLeave: true,
      statusText: '🛡️ FLEX-LEAVE ACTIVE: ₹0 EMI Cutoff (Zero Default Penalty Guarantee)',
      statusClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
    };
  }

  const calculatedCutoff = Math.round(numericEarnings * (ratePct / 100));
  const finalEmiCutoff = Math.min(cap, Math.max(15, calculatedCutoff));
  const netBankPayout = Math.max(0, numericEarnings - finalEmiCutoff);

  return {
    dailyEarnings: numericEarnings,
    emiCutoff: finalEmiCutoff,
    netBankPayout,
    isFlexLeave: false,
    statusText: `✅ DYNAMIC CUTOFF ACTIVE (${ratePct}% of Payout = ₹${finalEmiCutoff})`,
    statusClass: 'text-blue-400 bg-blue-950/80 border-blue-500/40',
  };
}

if (typeof window !== 'undefined') {
  let dailyEarnings = 1800;
  let cutoffPercentage = 7;
  let maxEmiCap = 150;

  function updateSimulatorUI() {
    const slider = document.getElementById('emi-earnings-slider');
    const input = document.getElementById('emi-earnings-input');
    const valEarnings = document.getElementById('sim-earnings-val');
    const valEmi = document.getElementById('sim-emi-val');
    const valNet = document.getElementById('sim-net-val');
    const statusBox = document.getElementById('sim-status-box');

    const val = Number(slider?.value || input?.value || dailyEarnings);
    dailyEarnings = val;

    if (slider) slider.value = val;
    if (input) input.value = val;

    const res = calculateEmiCutoff(val, cutoffPercentage, maxEmiCap);

    if (valEarnings) valEarnings.textContent = `₹${res.dailyEarnings.toLocaleString('en-IN')}`;
    if (valEmi) valEmi.textContent = `₹${res.emiCutoff.toLocaleString('en-IN')}`;
    if (valNet) valNet.textContent = `₹${res.netBankPayout.toLocaleString('en-IN')}`;

    if (statusBox) {
      statusBox.className = `p-3 rounded-xl border text-xs font-bold font-mono transition-all flex items-center justify-between ${res.statusClass}`;
      statusBox.innerHTML = `
        <span>${res.statusText}</span>
        <span class="text-[10px] uppercase px-2 py-0.5 rounded ${res.isFlexLeave ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}">${res.isFlexLeave ? '₹0 DEDUCTION' : `${cutoffPercentage}% CUTOFF`}</span>
      `;
    }
  }

  window.setEmiSimulatorEarnings = function(amt) {
    const slider = document.getElementById('emi-earnings-slider');
    const input = document.getElementById('emi-earnings-input');
    if (slider) slider.value = amt;
    if (input) input.value = amt;
    updateSimulatorUI();
  };

  window.calculateEmiCutoff = calculateEmiCutoff;
  window.updateEmiSimulatorUI = updateSimulatorUI;

  document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('emi-earnings-slider');
    const input = document.getElementById('emi-earnings-input');

    if (slider) slider.addEventListener('input', updateSimulatorUI);
    if (input) input.addEventListener('input', updateSimulatorUI);

    updateSimulatorUI();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateEmiCutoff };
}
