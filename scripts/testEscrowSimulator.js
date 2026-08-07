const { calculateEmiCutoff } = require('../frontend/js/escrowEmiSimulator.js');

console.log('--- TESTING ESCROW DYNAMIC DAILY EMI CUTOFF LOGIC ---');

const test1 = calculateEmiCutoff(0);
console.log('Flex-Leave Test (₹0 Earned):', test1);
if (test1.emiCutoff === 0 && test1.isFlexLeave === true) {
  console.log('✅ Flex-Leave Day Off Test PASSED: ₹0 EMI Cutoff!');
}

const test2 = calculateEmiCutoff(1200);
console.log('Normal Shift Test (₹1,200 Earned):', test2);
if (test2.emiCutoff === 84 && test2.netBankPayout === 1116) {
  console.log('✅ Normal Shift Test PASSED: 7% Cutoff (₹84 EMI, ₹1,116 Swept to Bank)!');
}

const test3 = calculateEmiCutoff(2800);
console.log('Peak Shift Test (₹2,800 Earned):', test3);
if (test3.emiCutoff === 150 && test3.netBankPayout === 2650) {
  console.log('✅ Peak Shift Test PASSED: Capped at Max ₹150 Daily EMI!');
}
