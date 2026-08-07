const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 28 High-Detail Realistic Financial Document Vector Images
const documentCategories = {
  bank: [
    {
      filename: 'hdfc_bank_statement_july.png',
      bankName: 'HDFC BANK LIMITED (FINVU AA ESCROW)',
      accNo: 'ESCROW-9042-881920',
      holder: 'Ramesh Kumar (Swiggy Fleet Lead)',
      period: '01-APR-2026 TO 31-JUL-2026',
      totalDeposits: '₹2,19,704.00',
      avgMonthly: '₹54,926.00',
      rows: [
        { date: '28-JUL-2026', desc: 'UPI-SWIGGY PAYOUT-ESCROW DEPOSIT', cr: '₹13,731.00', bal: '₹58,420.00' },
        { date: '25-JUL-2026', desc: 'GIGCREDIT AUTO MICRO-EMI DEDUCTION', cr: '-₹150.00', bal: '₹44,839.00' },
        { date: '21-JUL-2026', desc: 'UPI-ZOMATO HYPERLOCAL WEEKLY PAY', cr: '₹8,450.00', bal: '₹44,989.00' },
        { date: '14-JUL-2026', desc: 'UPI-BLINKIT DARKSTORE INCENTIVE', cr: '₹4,200.00', bal: '₹36,539.00' },
      ],
      accent: '#2563eb'
    },
    {
      filename: 'sbi_scanned_bank_statement.png',
      bankName: 'STATE BANK OF INDIA (GIG PAYROLL BRANCH)',
      accNo: 'SBI-3091-772411',
      holder: 'Amanpreet Singh',
      period: '01-APR-2026 TO 31-JUL-2026',
      totalDeposits: '₹1,92,800.00',
      avgMonthly: '₹48,200.00',
      rows: [
        { date: '29-JUL-2026', desc: 'NEFT-SWIFTEATS INDIA PAYOUT', cr: '₹12,050.00', bal: '₹48,200.00' },
        { date: '22-JUL-2026', desc: 'NEFT-ZIPMART LOGISTICS PAY', cr: '₹10,500.00', bal: '₹36,150.00' },
        { date: '15-JUL-2026', desc: 'GIGCREDIT AUTO EMI DEDUCTED', cr: '-₹135.00', bal: '₹25,650.00' },
        { date: '08-JUL-2026', desc: 'NEFT-SWIFTEATS WEEKLY BONUS', cr: '₹3,500.00', bal: '₹25,785.00' },
      ],
      accent: '#0284c7'
    },
    {
      filename: 'icici_cashflow_statement.png',
      bankName: 'ICICI BANK CORPORATE ESCROW SERVICES',
      accNo: 'ICICI-9921-441092',
      holder: 'Gurpreet Singh',
      period: '01-APR-2026 TO 31-JUL-2026',
      totalDeposits: '₹2,04,436.00',
      avgMonthly: '₹51,109.00',
      rows: [
        { date: '30-JUL-2026', desc: 'IMPS-PORTER FREIGHT LOGISTICS', cr: '₹14,500.00', bal: '₹51,109.00' },
        { date: '24-JUL-2026', desc: 'IMPS-UBER INDIA FREIGHT PAYOUT', cr: '₹11,200.00', bal: '₹36,609.00' },
        { date: '18-JUL-2026', desc: 'GIGCREDIT ESCROW EMI AUTO-CLEARED', cr: '-₹150.00', bal: '₹25,409.00' },
        { date: '10-JUL-2026', desc: 'IMPS-OLA EXPRESS FLEET CREDIT', cr: '₹8,900.00', bal: '₹25,559.00' },
      ],
      accent: '#7c3aed'
    },
    {
      filename: 'unity_trust_bank_farhan.png',
      bankName: 'UNITY SMALL FINANCE BANK (AA ESCROW)',
      accNo: 'UNITY-8841-209144',
      holder: 'Farhan Ali (EV Fleet Lead)',
      period: '01-APR-2026 TO 31-JUL-2026',
      totalDeposits: '₹1,42,592.00',
      avgMonthly: '₹35,648.00',
      rows: [
        { date: '31-JUL-2026', desc: 'UPI-ZIPMART EV DAILY PAYOUT', cr: '₹8,912.00', bal: '₹35,648.00' },
        { date: '24-JUL-2026', desc: 'UPI-ZEPTO 10-MIN EXPRESS PAY', cr: '₹9,400.00', bal: '₹26,736.00' },
        { date: '17-JUL-2026', desc: 'GIGCREDIT ESCROW EMI DEDUCTION', cr: '-₹100.00', bal: '₹17,336.00' },
        { date: '10-JUL-2026', desc: 'UPI-SWIFTEATS NIGHT SHIFT BONUS', cr: '₹4,200.00', bal: '₹17,436.00' },
      ],
      accent: '#059669'
    },
    {
      filename: 'unity_trust_bank_amanpreet.png',
      bankName: 'UNITY SMALL FINANCE BANK (AA ESCROW)',
      accNo: 'UNITY-7731-902148',
      holder: 'Amanpreet Singh',
      period: '01-APR-2026 TO 31-JUL-2026',
      totalDeposits: '₹1,93,292.00',
      avgMonthly: '₹48,323.00',
      rows: [
        { date: '30-JUL-2026', desc: 'NEFT-SWIFTEATS FLEET PAYOUT', cr: '₹12,080.00', bal: '₹48,323.00' },
        { date: '23-JUL-2026', desc: 'NEFT-ZIPMART LOGISTICS BONUS', cr: '₹9,800.00', bal: '₹36,243.00' },
        { date: '16-JUL-2026', desc: 'GIGCREDIT AUTO EMI DEDUCTED', cr: '-₹135.00', bal: '₹26,443.00' },
        { date: '09-JUL-2026', desc: 'NEFT-SWIFTEATS RAIN INCENTIVE', cr: '₹3,200.00', bal: '₹26,578.00' },
      ],
      accent: '#db2777'
    },
    {
      filename: 'edited_tampered_statement.png',
      bankName: '⚠️ UNVERIFIED / TAMPERED BANK DOCUMENT',
      accNo: 'UNKNOWN-XXXX-XXXXX',
      holder: 'Unverified Applicant',
      period: 'INVALID DATE STAMP',
      totalDeposits: 'UNKNOWN / MISMATCH',
      avgMonthly: 'DISCREPANCY DETECTED',
      rows: [
        { date: '??-???-2026', desc: '⚠️ FONT MISMATCH DETECTED BY FRAUD AGENT', cr: '₹99,999.00', bal: '₹99,999.00' },
        { date: '??-???-2026', desc: '⚠️ DIGITAL SIGNATURE MODIFIED / MISSING', cr: '₹0.00', bal: 'ERR_TAMPERED' },
        { date: '??-???-2026', desc: '⚠️ AUTHENTICITY AUDIT FAILED (-180 SCORE PENALTY)', cr: 'FLAGGED', bal: 'RISK_HIGH' },
      ],
      accent: '#dc2626'
    },
    {
      filename: 'starter_cashflow_statement.png',
      bankName: 'PAYTM PAYMENTS BANK (STARTER ACCOUNT)',
      accNo: 'PAYTM-9102-441092',
      holder: 'New Driver Applicant',
      period: '01-JUL-2026 TO 31-JUL-2026',
      totalDeposits: '₹18,500.00',
      avgMonthly: '₹18,500.00',
      rows: [
        { date: '28-JUL-2026', desc: 'UPI-SWIGGY SOLO WEEKLY DEPOSIT', cr: '₹4,625.00', bal: '₹18,500.00' },
        { date: '21-JUL-2026', desc: 'UPI-SWIGGY SOLO WEEKLY DEPOSIT', cr: '₹4,625.00', bal: '₹13,875.00' },
        { date: '14-JUL-2026', desc: 'UPI-SWIGGY SOLO WEEKLY DEPOSIT', cr: '₹4,625.00', bal: '₹9,250.00' },
        { date: '07-JUL-2026', desc: 'UPI-SWIGGY SOLO WEEKLY DEPOSIT', cr: '₹4,625.00', bal: '₹4,625.00' },
      ],
      accent: '#d97706'
    },
  ],
};

function createDocumentSVG(d) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="650" viewBox="0 0 900 650">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0b0f19"/>
        <stop offset="100%" stop-color="#111827"/>
      </linearGradient>
    </defs>

    <rect width="900" height="650" fill="url(#bgGrad)"/>
    <rect x="25" y="25" width="850" height="600" rx="20" fill="#1e293b" fill-opacity="0.5" stroke="${d.accent}" stroke-width="2"/>

    <!-- Document Header -->
    <rect x="50" y="50" width="800" height="85" rx="14" fill="#0f172a" stroke="${d.accent}" stroke-width="1.5"/>
    <text x="75" y="88" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="20" letter-spacing="0.5">${d.bankName}</text>
    <text x="75" y="115" fill="${d.accent}" font-family="monospace" font-weight="700" font-size="13">ACCOUNT NO: ${d.accNo} | HOLDER: ${d.holder}</text>
    <rect x="680" y="70" width="150" height="45" rx="8" fill="${d.accent}" fill-opacity="0.2" stroke="${d.accent}" stroke-width="1"/>
    <text x="755" y="97" text-anchor="middle" fill="${d.accent}" font-family="sans-serif" font-weight="800" font-size="12">VERIFIED AA PASSPORT</text>

    <!-- Metrics Bar -->
    <rect x="50" y="150" width="800" height="65" rx="12" fill="#090d16" stroke="#334155" stroke-width="1"/>
    <text x="75" y="175" fill="#94a3b8" font-family="sans-serif" font-size="11">STATEMENT TIMELINE</text>
    <text x="75" y="198" fill="#ffffff" font-family="monospace" font-weight="bold" font-size="14">${d.period}</text>

    <text x="350" y="175" fill="#94a3b8" font-family="sans-serif" font-size="11">4-MONTH TOTAL DEPOSITS</text>
    <text x="350" y="198" fill="#10b981" font-family="monospace" font-weight="bold" font-size="16">${d.totalDeposits}</text>

    <text x="620" y="175" fill="#94a3b8" font-family="sans-serif" font-size="11">AVERAGE MONTHLY INCOME</text>
    <text x="620" y="198" fill="${d.accent}" font-family="monospace" font-weight="bold" font-size="16">${d.avgMonthly}</text>

    <!-- Line Item Table -->
    <rect x="50" y="235" width="800" height="310" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1"/>
    
    <!-- Table Header -->
    <rect x="50" y="235" width="800" height="40" rx="12" fill="#1e293b"/>
    <text x="75" y="260" fill="#94a3b8" font-family="monospace" font-weight="bold" font-size="12">TRANSACTION DATE</text>
    <text x="240" y="260" fill="#94a3b8" font-family="monospace" font-weight="bold" font-size="12">DESCRIPTION / PARTICULARS</text>
    <text x="600" y="260" fill="#94a3b8" font-family="monospace" font-weight="bold" font-size="12">AMOUNT (INR)</text>
    <text x="740" y="260" fill="#94a3b8" font-family="monospace" font-weight="bold" font-size="12">RUNNING BAL</text>

    <!-- Table Rows -->
    ${d.rows.map((r, i) => `
      <line x1="50" y1="${275 + (i + 1) * 55}" x2="850" y2="${275 + (i + 1) * 55}" stroke="#1e293b" stroke-width="1"/>
      <text x="75" y="${310 + i * 55}" fill="#cbd5e1" font-family="monospace" font-size="13">${r.date}</text>
      <text x="240" y="${310 + i * 55}" fill="#ffffff" font-family="sans-serif" font-weight="600" font-size="13">${r.desc}</text>
      <text x="600" y="${310 + i * 55}" fill="${r.cr.startsWith('-') ? '#ef4444' : '#10b981'}" font-family="monospace" font-weight="bold" font-size="14">${r.cr}</text>
      <text x="740" y="${310 + i * 55}" fill="#94a3b8" font-family="monospace" font-size="13">${r.bal}</text>
    `).join('')}

    <!-- Footer Stamp -->
    <rect x="50" y="560" width="800" height="50" rx="10" fill="#090d16" stroke="#334155" stroke-width="1"/>
    <text x="75" y="590" fill="#64748b" font-family="monospace" font-size="11">GigCredit Automated Escrow Network • Underwriting Certificate #GC-2026-${Math.floor(Math.random()*90000+10000)}</text>
    <circle cx="810" cy="585" r="14" fill="${d.accent}"/>
    <text x="804" y="590" fill="#ffffff" font-weight="bold" font-size="14">✓</text>
  </svg>`;
}

// Generate for all categories
let count = 0;
documentCategories.bank.forEach(d => {
  const filePath = path.join(uploadsDir, d.filename);
  const svg = createDocumentSVG(d);
  fs.writeFileSync(filePath, svg, 'utf8');
  count++;
});

// Also create default fallback SVG files for payouts, ratings, and upi
const otherFiles = [
  'swiggy_zomato_weekly_payout.png',
  'blinkit_zepto_pay_stub.png',
  'gurpreet_express_freight_log.png',
  'uber_ola_earnings_summary.png',
  'ananya_urbancompany_paystub.png',
  'vikram_rapido_shadowfax_receipt.png',
  'unverified_solo_paystub.png',
  'fleet_captain_4_9_star_badge.png',
  'zomato_gold_badge_rating.png',
  'porter_super_star_driver.png',
  'zepto_5star_courier.png',
  'urbancompany_diamond_badge.png',
  'shadowfax_silver_captain.png',
  'unrated_starter_badge.png',
  'upi_phonepe_history_july.png',
  'paytm_upi_statement.png',
  'gpay_business_upi_log.png',
  'amazon_pay_cashflow_log.png',
  'bhim_escrow_direct_log.png',
  'cred_upi_settlement_log.png',
  'high_outflow_upi_log.png',
];

otherFiles.forEach(filename => {
  const filePath = path.join(uploadsDir, filename);
  const title = filename.replace(/_/g, ' ').replace('.png', '').toUpperCase();
  const fallbackDoc = {
    filename,
    bankName: `GIGCREDIT VERIFIED ${title}`,
    accNo: `DOCUMENT-GC-${Math.floor(Math.random()*90000+10000)}`,
    holder: 'Verified Rider Applicant',
    period: '01-APR-2026 TO 31-JUL-2026',
    totalDeposits: '₹1,84,200.00',
    avgMonthly: '₹46,050.00',
    rows: [
      { date: '28-JUL-2026', desc: `VERIFIED INGESTION: ${title}`, cr: '₹12,450.00', bal: '₹46,050.00' },
      { date: '21-JUL-2026', desc: 'AUTOMATED ESCROW DEPOSIT MATCH', cr: '₹11,800.00', bal: '₹33,600.00' },
      { date: '14-JUL-2026', desc: 'MULTI-APP VELOCITY AUDIT PASSED', cr: '₹10,500.00', bal: '₹21,800.00' },
      { date: '07-JUL-2026', desc: 'FINVU AA SECURITY HANDSHAKE', cr: '₹11,300.00', bal: '₹11,300.00' },
    ],
    accent: '#10b981'
  };
  fs.writeFileSync(filePath, createDocumentSVG(fallbackDoc), 'utf8');
  count++;
});

console.log(`Generated ${count} rich document SVG/PNG vector files in uploads/!`);
