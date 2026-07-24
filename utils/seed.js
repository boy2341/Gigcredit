/**
 * Seeds the database with a few demo workers, a demo lender, connected
 * platforms, wallets and system loan offers so the app has something to
 * show immediately. Run with: npm run seed
 */
require('dotenv').config();
const connectDB = require('../config/db');
const Worker = require('../models/Worker');
const Lender = require('../models/Lender');
const Wallet = require('../models/Wallet');
const LoanOffer = require('../models/LoanOffer');
const Loan = require('../models/Loan');
const { calculateGigScore, calculateMonthlyIncome } = require('./gigScore');
const { generatePlatformData, generateWalletTransactions, generateSystemLoanOffers } = require('./mockData');

const DEMO_WORKERS = [
  { name: 'Alex Rivera', email: 'alex@worker.com', password: 'password123', platforms: ['Uber', 'Swiggy', 'Blinkit'] },
  { name: 'Priya Sharma', email: 'priya@worker.com', password: 'password123', platforms: ['Rapido', 'Zepto'] },
  { name: 'Marcus Chen', email: 'marcus@worker.com', password: 'password123', platforms: ['Amazon Flex', 'Porter', 'Uber'] },
];

const DEMO_LENDER = { name: 'Jordan Blake', email: 'lender@institution.com', password: 'password123', institutionName: 'Meridian Capital' };

const run = async () => {
  await connectDB();
  console.log('[SEED] Clearing existing demo collections...');
  await Promise.all([Worker.deleteMany({}), Lender.deleteMany({}), Wallet.deleteMany({}), LoanOffer.deleteMany({}), Loan.deleteMany({})]);

  console.log('[SEED] Creating lender...');
  const lender = await Lender.create({ ...DEMO_LENDER, activePortfolioValue: 0, totalMoneyLent: 0 });

  for (const w of DEMO_WORKERS) {
    console.log(`[SEED] Creating worker ${w.name}...`);
    const platforms = w.platforms.map(generatePlatformData);
    const accountAgeMonths = 6 + platforms.length * 3;
    const { score, breakdown, riskTier } = calculateGigScore({ platforms, accountAgeMonths });

    const worker = await Worker.create({
      name: w.name,
      email: w.email,
      password: w.password,
      phone: '+1 555 010 0000',
      connectedPlatforms: platforms,
      accountAgeMonths,
      gigCreditScore: score,
      scoreBreakdown: breakdown,
      riskTier,
      bankConnected: true,
      bankName: 'Chase',
      bankAccountMasked: '****4821',
    });

    const demoTx = generateWalletTransactions(platforms);
    const balance = Math.round(demoTx.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0) * 100) / 100;
    await Wallet.create({ worker: worker._id, balance: Math.max(balance, 50), transactions: demoTx });

    const monthlyIncome = calculateMonthlyIncome(platforms);
    const offers = generateSystemLoanOffers({ score, monthlyIncome });
    await LoanOffer.insertMany(offers.map((o) => ({ ...o, worker: worker._id })));
  }

  console.log('[SEED] Done!');
  console.log('--------------------------------------------------');
  console.log('Demo worker logins (role="worker"):');
  DEMO_WORKERS.forEach((w) => console.log(`  ${w.email} / ${w.password}`));
  console.log('Demo lender login (role="lender"):');
  console.log(`  ${DEMO_LENDER.email} / ${DEMO_LENDER.password}`);
  console.log('--------------------------------------------------');
  process.exit(0);
};

run().catch((err) => {
  console.error('[SEED] Failed:', err);
  process.exit(1);
});
