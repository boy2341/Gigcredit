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
  {
    name: 'Ramesh Kumar',
    email: 'ramesh@worker.com',
    password: 'password123',
    phone: '+91 98765 43210',
    upiId: 'ramesh@okaxis',
    city: 'Delhi NCR',
    vehicleType: 'EV Scooter',
    preferredLanguage: 'Hindi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tagline: 'Swiggy & Zomato Senior Fleet Captain',
    bio: 'Full-time EV delivery partner & quick-commerce specialist across Swiggy, Zomato & Blinkit in Delhi NCR.',
    platforms: ['Swiggy', 'Zomato', 'Blinkit'],
    accountAgeMonths: 22,
    bankName: 'HDFC Bank',
    bankAccountMasked: '****4821',
    microEMIDeductionRate: 100, // ₹100/day
  },
  {
    name: 'Amanpreet Singh',
    email: 'amanpreet@worker.com',
    password: 'password123',
    phone: '+91 98112 33445',
    upiId: 'amanpreet@payease',
    city: 'Delhi NCR',
    vehicleType: 'Motorcycle',
    preferredLanguage: 'English',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    tagline: 'SwiftEats & ZipMart Delivery Partner',
    bio: 'Verified rider partner on SwiftEats (4.4⭐) and ZipMart (4.1⭐) with Unity Trust Bank statement verification.',
    platforms: ['SwiftEats', 'ZipMart'],
    accountAgeMonths: 18,
    bankName: 'Unity Trust Bank',
    bankAccountMasked: 'XXXXXXXX6621',
    microEMIDeductionRate: 35,
  },
  {
    name: 'Farhan Ali',
    email: 'farhan@worker.com',
    password: 'password123',
    phone: '+91 98450 67890',
    upiId: 'farhan@payease',
    city: 'Mumbai',
    vehicleType: 'EV Scooter',
    preferredLanguage: 'Hindi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    tagline: 'ZipMart & SwiftEats Fleet Specialist',
    bio: 'High-performing fleet captain maintaining 4.88⭐ average rating on ZipMart and SwiftEats in Mumbai.',
    platforms: ['ZipMart', 'SwiftEats'],
    accountAgeMonths: 24,
    bankName: 'Unity Trust Bank',
    bankAccountMasked: 'XXXXXXXX3387',
    microEMIDeductionRate: 100,
  },
  {
    name: 'Priya Sharma',
    email: 'priya@worker.com',
    password: 'password123',
    phone: '+91 98123 45678',
    upiId: 'priya@okhdfcbank',
    city: 'Bengaluru',
    vehicleType: 'EV Scooter',
    preferredLanguage: 'Kannada',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    tagline: 'Dark Store & Quick-Commerce Specialist',
    bio: 'Fast delivery captain maintaining 4.95 rating on Zepto, Rapido, and Urban Company in Koramangala.',
    platforms: ['Zepto', 'Rapido', 'Urban Company'],
    accountAgeMonths: 14,
    bankName: 'ICICI Bank',
    bankAccountMasked: '****8832',
    microEMIDeductionRate: 100,
  },
  {
    name: 'Gurpreet Singh',
    email: 'gurpreet@worker.com',
    password: 'password123',
    phone: '+91 99887 76655',
    upiId: 'gurpreet@paytm',
    city: 'Chandigarh',
    vehicleType: 'Delivery Van',
    preferredLanguage: 'Punjabi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    tagline: 'Heavy Freight & Express Courier Lead',
    bio: 'Logistics operator managing heavy parcel deliveries across Porter, Uber India & Ola in North India.',
    platforms: ['Porter', 'Uber India', 'Ola'],
    accountAgeMonths: 28,
    bankName: 'State Bank of India (SBI)',
    bankAccountMasked: '****1940',
    microEMIDeductionRate: 150,
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya@worker.com',
    password: 'password123',
    phone: '+91 97654 32109',
    upiId: 'ananya@ybl',
    city: 'Mumbai',
    vehicleType: 'EV Scooter',
    preferredLanguage: 'Marathi',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    tagline: 'Urban Services & Instant Grocery Pro',
    bio: 'Home services and instant grocery captain handling Urban Company & Swiggy Instamart orders in Mumbai.',
    platforms: ['Urban Company', 'Swiggy', 'Blinkit'],
    accountAgeMonths: 16,
    bankName: 'Axis Bank',
    bankAccountMasked: '****7712',
    microEMIDeductionRate: 100,
  },
  {
    name: 'Vikramaditya Verma',
    email: 'vikram@worker.com',
    password: 'password123',
    phone: '+91 96543 21098',
    upiId: 'vikram@postbank',
    city: 'Jaipur',
    vehicleType: 'Motorcycle',
    preferredLanguage: 'Hindi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    tagline: 'Hyperlocal Logistics Rider',
    bio: 'Building portable credit through daily closed-loop micro-EMI repayments across Shadowfax & Rapido.',
    platforms: ['Shadowfax', 'Rapido'],
    accountAgeMonths: 8,
    bankName: 'Punjab National Bank',
    bankAccountMasked: '****3391',
    microEMIDeductionRate: 80,
  },
  {
    name: 'Ayesha Khan',
    email: 'ayesha@worker.com',
    password: 'password123',
    phone: '+91 95432 10987',
    upiId: 'ayesha@ibl',
    city: 'Hyderabad',
    vehicleType: 'EV Scooter',
    preferredLanguage: 'Telugu',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    tagline: 'Top-Tier Grocery Fleet Lead',
    bio: 'Ultra-fast delivery captain with 99.8% order accuracy across Blinkit & Zepto in Hitech City.',
    platforms: ['Blinkit', 'Zepto', 'Swiggy'],
    accountAgeMonths: 24,
    bankName: 'Kotak Mahindra Bank',
    bankAccountMasked: '****5520',
    microEMIDeductionRate: 120,
  },
];

const DEMO_LENDERS = [
  {
    name: 'Bharat Gig Finance Ltd.',
    email: 'lender@institution.com',
    password: 'password123',
    institutionName: 'Bharat Gig Finance Ltd.',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    nbfcLicenseNo: 'FIN-INST-03290',
    rbiRegistrationNo: 'REG-INST-884210',
    headquarters: 'Mumbai, Maharashtra',
    collectionRate: 99.6,
  },
  {
    name: 'Lendingkart Micro Capital',
    email: 'lendingkart@institution.com',
    password: 'password123',
    institutionName: 'Lendingkart Micro Trust (NBFC-MFI)',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    nbfcLicenseNo: 'NBFC-RBI-L.09.00192',
    rbiRegistrationNo: 'RBI/NBFC/MFI/2021-99010',
    headquarters: 'Bengaluru, Karnataka',
    collectionRate: 99.4,
  },
];

const run = async () => {
  await connectDB();
  console.log('[SEED] Clearing existing collections...');
  await Promise.all([Worker.deleteMany({}), Lender.deleteMany({}), Wallet.deleteMany({}), LoanOffer.deleteMany({}), Loan.deleteMany({})]);

  console.log('[SEED] Creating institutional lenders...');
  const createdLenders = await Promise.all(
    DEMO_LENDERS.map((l) => Lender.create({ ...l, activePortfolioValue: 125000, totalMoneyLent: 450000, isDemoAccount: true }))
  );

  const primaryLender = createdLenders[0];

  for (let idx = 0; idx < DEMO_WORKERS.length; idx += 1) {
    const w = DEMO_WORKERS[idx];
    console.log(`[SEED] Creating worker ${w.name}...`);
    const platforms = w.platforms.map(generatePlatformData);
    const { score, breakdown, underwritingMetrics, riskTier } = calculateGigScore({ platforms, accountAgeMonths: w.accountAgeMonths });

    const worker = await Worker.create({
      name: w.name,
      email: w.email,
      password: w.password,
      phone: w.phone,
      upiId: w.upiId,
      city: w.city,
      vehicleType: w.vehicleType,
      preferredLanguage: w.preferredLanguage,
      avatarUrl: w.avatarUrl,
      tagline: w.tagline,
      bio: w.bio,
      kycStatus: {
        panNumber: `ABCDE${1000 + idx}F`,
        aadhaarLast4: `99${20 + idx}`,
        verified: true,
      },
      connectedPlatforms: platforms,
      accountAgeMonths: w.accountAgeMonths,
      gigCreditScore: score,
      scoreBreakdown: breakdown,
      underwritingMetrics,
      riskTier,
      bankConnected: true,
      bankName: w.bankName,
      bankAccountMasked: w.bankAccountMasked,
      accountAggregatorConsent: {
        granted: true,
        provider: 'Finvu AA Rails',
        consentId: `AA-FINVU-${9920 + idx}`,
        aaHandle: `${w.email.split('@')[0]}@finvu`,
      },
      escrowVirtualAccount: {
        accountId: `ESCROW-9042-${8810 + idx}`,
        ifscCode: 'HDFC0000240',
        bankName: 'HDFC Bank Escrow Services',
        status: 'Active Escrow Provisioned',
      },
      microEMIDeductionRate: w.microEMIDeductionRate || 100,
      isDemoAccount: true,
    });

    const demoTx = generateWalletTransactions(platforms);
    const balance = Math.round(demoTx.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0) * 100) / 100;
    await Wallet.create({ worker: worker._id, balance: Math.max(balance, 120), escrowVirtualAccountId: worker.escrowVirtualAccount.accountId, transactions: demoTx });

    const monthlyIncome = calculateMonthlyIncome(platforms);
    const offers = generateSystemLoanOffers({ score, monthlyIncome });
    const insertedOffers = await LoanOffer.insertMany(offers.map((o) => ({ ...o, worker: worker._id })));

    // Create 1 active loan for Alex Rivera and Marcus Chen for demonstration
    if (w.name === 'Alex Rivera' || w.name === 'Marcus Chen') {
      const selectedOffer = insertedOffers[0];
      const principal = selectedOffer.amount;
      const interestRate = selectedOffer.interestRate;
      const tenure = selectedOffer.tenureMonths;
      const monthlyEMI = Math.round((principal * (1 + (interestRate / 100))) / tenure);

      await Loan.create({
        worker: worker._id,
        lender: primaryLender._id,
        offer: selectedOffer._id,
        title: selectedOffer.title,
        principal,
        interestRate,
        tenureMonths: tenure,
        monthlyEMI,
        outstandingBalance: Math.round(principal * 0.7),
        amountRepaid: Math.round(principal * 0.3),
        status: 'active',
        nextDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        repayments: [
          { amount: monthlyEMI, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), status: 'paid' },
        ],
      });

      selectedOffer.status = 'accepted';
      await selectedOffer.save();
    }
  }

  console.log('[SEED] Seeding successful!');
  console.log('--------------------------------------------------');
  console.log('Demo Workers created: 6');
  console.log('Demo Lenders created: 2');
  console.log('--------------------------------------------------');
  process.exit(0);
};

run().catch((err) => {
  console.error('[SEED] Failed:', err);
  process.exit(1);
});
