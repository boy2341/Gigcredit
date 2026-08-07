/**
 * ============================================================================
 * GigCredit - Reference PDF Sample Document Generator Script
 * Generates physical reference PDF statements (Amanpreet Singh, Farhan Ali, Ramesh Kumar) in /uploads.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Minimal valid PDF generator helper
function createSimplePdf(title, textLines) {
  const contentText = textLines.join('\n');
  const streamText = `BT /F1 11 Tf 40 750 Td (${title}) Tj 0 -18 Td (${contentText.replace(/\n/g, ') Tj 0 -14 Td (')}) Tj ET`;
  
  const pdfBody = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj
4 0 obj <</Length ${streamText.length}>> stream
${streamText}
endstream endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000242 00000 n 
0000000300+0 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
400
%%EOF`;

  return Buffer.from(pdfBody);
}

// 1. Unity Trust Bank - Amanpreet Singh Reference PDF
const amanpreetPdf = createSimplePdf('UNITY TRUST BANK STATEMENT - AMANPREET SINGH', [
  'Account Holder: Amanpreet Singh | Account No: XXXXXXXX6621 | IFSC: UTBK0009981',
  'Statement Period: 01 Apr 2026 - 28 Apr 2026',
  '==================================================================',
  'Opening Balance: INR 42,150.30 | Closing Balance: INR 50,790.84',
  'Total Credits  : INR 21,303.00 | Total Debits  : INR 12,662.46',
  '------------------------------------------------------------------',
  '03-APR-2026: SwiftEats Payout +INR 1,938.14 (CREDIT)',
  '05-APR-2026: ZipMart Payout   +INR 3,260.04 (CREDIT)',
  '08-APR-2026: Fuel Station     -INR   824.56 (DEBIT)',
  '10-APR-2026: SwiftEats Payout +INR 1,827.60 (CREDIT)',
  '12-APR-2026: ZipMart Payout   +INR 3,371.93 (CREDIT)',
  '13-APR-2026: Vehicle EMI      -INR 4,292.00 (DEBIT)',
  '17-APR-2026: SwiftEats Payout +INR 1,967.57 (CREDIT)',
  '18-APR-2026: Rent / Room Pay  -INR 4,079.61 (DEBIT)',
  '19-APR-2026: ZipMart Payout   +INR 3,627.92 (CREDIT)',
  '24-APR-2026: SwiftEats Payout +INR 2,014.80 (CREDIT)',
  '26-APR-2026: ZipMart Payout   +INR 3,295.00 (CREDIT)',
  '==================================================================',
  'SwiftEats Earnings: INR 7,748.11 | ZipMart Earnings: INR 13,554.89',
  'Rider Ratings: SwiftEats 4.4 ⭐ | ZipMart 4.1 ⭐',
  'Verified Status: 100% MATCHED VIA GIGCREDIT AGENTS',
]);
fs.writeFileSync(path.join(uploadsDir, 'unity_trust_bank_amanpreet.pdf'), amanpreetPdf);

// 2. Unity Trust Bank - Farhan Ali Reference PDF
const farhanPdf = createSimplePdf('UNITY TRUST BANK STATEMENT - FARHAN ALI', [
  'Account Holder: Farhan Ali | Account No: XXXXXXXX3387 | IFSC: UTBK0004417',
  'Statement Period: 01 Apr 2026 - 28 Apr 2026',
  '==================================================================',
  'Opening Balance: INR 42,150.30 | Closing Balance: INR 68,850.00',
  'Total Credits  : INR 35,155.12 | Total Debits  : INR  8,455.42',
  '------------------------------------------------------------------',
  '03-APR-2026: SwiftEats Payout +INR 3,800.17 (CREDIT)',
  '05-APR-2026: ZipMart Payout   +INR 5,096.47 (CREDIT)',
  '10-APR-2026: SwiftEats Payout +INR 3,516.91 (CREDIT)',
  '12-APR-2026: ZipMart Payout   +INR 5,192.64 (CREDIT)',
  '17-APR-2026: SwiftEats Payout +INR 3,512.32 (CREDIT)',
  '18-APR-2026: Rent / Room Pay  -INR 4,687.14 (DEBIT)',
  '19-APR-2026: ZipMart Payout   +INR 4,912.40 (CREDIT)',
  '24-APR-2026: SwiftEats Payout +INR 4,003.00 (CREDIT)',
  '26-APR-2026: ZipMart Payout   +INR 5,121.21 (CREDIT)',
  '==================================================================',
  'ZipMart Earnings: INR 20,322.72 | SwiftEats Earnings: INR 14,832.40',
  'Rider Ratings: ZipMart 4.85 ⭐ | SwiftEats 4.90 ⭐',
  'Verified Status: PRIME TIER VERIFIED (GIGSCORE: 768 / 900)',
]);
fs.writeFileSync(path.join(uploadsDir, 'unity_trust_bank_farhan.pdf'), farhanPdf);

// 3. Genuine 4-Month HDFC Bank Statement PDF (Ramesh Kumar)
const hdfc4MonthPdf = createSimplePdf('HDFC BANK 4-MONTH ESCROW STATEMENT - RAMESH KUMAR', [
  'Account: ****4821 | IFSC: HDFC0000240 | Holder: Ramesh Kumar',
  'Statement Period: 01-APR-2026 to 31-JUL-2026 (4 FULL MONTHS)',
  '==================================================================',
  'April Subtotal Verified: INR 14,500.00',
  'May Subtotal Verified  : INR 15,500.00',
  'June Subtotal Verified : INR 15,000.00',
  'July Subtotal Verified : INR 16,300.00',
  '==================================================================',
  '4-MONTH TOTAL VERIFIED INCOME: INR 61,300.00',
  'AVERAGE VERIFIED MONTHLY INCOME: INR 15,325.00 / Month',
]);
fs.writeFileSync(path.join(uploadsDir, 'hdfc_bank_statement_july.pdf'), hdfc4MonthPdf);

// 4. Tampered 4-Month Statement PDF
const tampered4MonthPdf = createSimplePdf('4-MONTH TAMPERED STATEMENT - FORGED LINE ITEMS', [
  'Producer Header: /Producer (Canva/Photoshop Export)',
  'Account Number: ****4821 | Period: Apr 2026 - Jul 2026',
  '07-APR-2026: Swiggy Payout +INR 4,250.00',
  '14-MAY-2026: Altered Zomato Line +INR 65,000.00 (FONT MISMATCH)',
  'Warning: Balance continuity & 4-month running math audit failed.',
]);
fs.writeFileSync(path.join(uploadsDir, 'edited_tampered_statement.pdf'), tampered4MonthPdf);

// 5. 4-Month Swiggy & Zomato Multi-Platform Summary PDF
const payout4MonthPdf = createSimplePdf('4-MONTH SWIGGY & ZOMATO PAYOUT SUMMARY', [
  'Rider: Ramesh Kumar (Senior Fleet Captain)',
  'Period: 01-APR-2026 to 31-JUL-2026 (120 Active Days)',
  '4-Month Combined Earnings: INR 61,300',
  'Average Rating Across 4 Months: 4.88 ⭐ (1,335 Total Deliveries)',
]);
fs.writeFileSync(path.join(uploadsDir, 'swiggy_zomato_weekly_payout.pdf'), payout4MonthPdf);

// 6. 4-Month PhonePe UPI Log PDF
const upi4MonthPdf = createSimplePdf('4-MONTH PHONEPE UPI CASHFLOW & REPAYMENT LOG', [
  'UPI ID: ramesh@okaxis | Period: Apr 2026 - Jul 2026',
  '4-Month Total Micro-EMIs Deducted: INR 10,900 (109 Days Cleared)',
  '4-Month On-Time Repayment Discipline: 99.1% Perfect Standing',
]);
fs.writeFileSync(path.join(uploadsDir, 'upi_phonepe_history_july.pdf'), upi4MonthPdf);

console.log('✅ Physical Reference PDF files generated successfully in /uploads!');
