const http = require('http');

const combinations = [
  { bankDoc: 'hdfc_bank_statement_july.png', payoutDoc: 'swiggy_zomato_weekly_payout.png', ratingDoc: 'fleet_captain_4_9_star_badge.png', upiDoc: 'upi_phonepe_history_july.png' },
  { bankDoc: 'icici_cashflow_statement.png', payoutDoc: 'gurpreet_express_freight_log.png', ratingDoc: 'porter_super_star_driver.png', upiDoc: 'bhim_escrow_direct_log.png' },
  { bankDoc: 'sbi_scanned_bank_statement.png', payoutDoc: 'blinkit_zepto_pay_stub.png', ratingDoc: 'zepto_5star_courier.png', upiDoc: 'paytm_upi_statement.png' },
  { bankDoc: 'unity_trust_bank_farhan.png', payoutDoc: 'vikram_rapido_shadowfax_receipt.png', ratingDoc: 'shadowfax_silver_captain.png', upiDoc: 'amazon_pay_cashflow_log.png' },
  { bankDoc: 'edited_tampered_statement.png', payoutDoc: 'swiggy_zomato_weekly_payout.png', ratingDoc: 'fleet_captain_4_9_star_badge.png', upiDoc: 'upi_phonepe_history_july.png' },
  { bankDoc: 'starter_cashflow_statement.png', payoutDoc: 'unverified_solo_paystub.png', ratingDoc: 'unrated_starter_badge.png', upiDoc: 'high_outflow_upi_log.png' },
];

async function runTest() {
  console.log('--- TESTING 4-DOCUMENT COMBINATION MULTI-SCORE UNDERWRITING ---');
  for (let i = 0; i < combinations.length; i++) {
    const combo = combinations[i];
    const postData = JSON.stringify(combo);
    
    await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5001,
        path: '/api/agents/run-pipeline',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const json = JSON.parse(body);
          const gigScore = json.pipelineResults.gigScore;
          console.log(`Combo ${i+1}: [Bank: ${combo.bankDoc.split('.')[0]} | Payout: ${combo.payoutDoc.split('.')[0]}] -> GigScore: ${gigScore.score}/900 | Risk: ${gigScore.riskTier} | Credit: ₹${gigScore.approvedCreditLine.toLocaleString('en-IN')}`);
          resolve();
        });
      });

      req.write(postData);
      req.end();
    });
  }
}

runTest();
