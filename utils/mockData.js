const GIG_PLATFORMS = ['Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Uber India', 'Ola', 'Porter', 'Rapido', 'Urban Company', 'Shadowfax'];

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const round2 = (n) => Math.round(n * 100) / 100;

/** Generates realistic-looking demo stats for a single connected Indian gig platform */
function generatePlatformData(platform) {
  return {
    platform,
    connectedAt: new Date(),
    monthlyEarnings: randInt(8500, 24500), // In INR ₹
    rating: round2(rand(4.3, 5.0)),
    completedJobs: randInt(250, 2400),
    cancellationRate: round2(rand(0.2, 3.5)),
  };
}

/** Generates demo wallet transactions formatted in INR (₹) */
function generateWalletTransactions(platforms = []) {
  const sources = platforms.length ? platforms.map((p) => p.platform) : GIG_PLATFORMS.slice(0, 3);
  const count = randInt(6, 10);
  const transactions = [];
  let daysAgo = randInt(1, 2);

  // Initial closed-loop escrow micro EMI transaction
  transactions.push({
    type: 'debit',
    category: 'micro_emi_deduction',
    amount: 100, // ₹100 daily micro EMI
    description: 'Closed-loop micro-EMI auto-deducted at Escrow source',
    source: 'Escrow Virtual Gateway (HDFC0000240)',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
  });

  for (let i = 0; i < count; i += 1) {
    const isPayout = Math.random() < 0.75;
    const source = pick(sources);
    const amount = isPayout ? randInt(1200, 4800) : randInt(800, 3500);
    transactions.push({
      type: isPayout ? 'credit' : 'debit',
      category: isPayout ? 'gig_payout' : 'withdrawal',
      amount,
      description: isPayout ? `Direct payout from ${source} to Escrow Account` : 'Sweep to Linked Primary Savings (HDFC/ICICI)',
      source: isPayout ? `${source} Escrow Account` : 'Linked Primary Savings',
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
    daysAgo += randInt(1, 3);
  }

  return transactions.sort((a, b) => b.date - a.date);
}

/** Generates 3 pre-approved / marketplace-style loan offers in INR ₹ */
function generateSystemLoanOffers({ score, monthlyIncome }) {
  const tier = score >= 740 ? 'prime' : score >= 620 ? 'standard' : 'starter';

  const rateFor = (base) => {
    if (tier === 'prime') return round2(base - 3.0);
    if (tier === 'standard') return round2(base);
    return round2(base + 4.5);
  };

  const templates = [
    {
      title: 'EV Two-Wheeler Fleet Upgrade Loan',
      amount: Math.min(Math.max(Math.round(monthlyIncome * 3.5), 15000), 120000),
      interestRate: rateFor(9.5),
      tenureMonths: 18,
      purpose: 'EV Scooter battery swap & maintenance package',
    },
    {
      title: 'Festival Working Capital Shield',
      amount: Math.min(Math.max(Math.round(monthlyIncome * 1.5), 8000), 45000),
      interestRate: rateFor(12.5),
      tenureMonths: 6,
      purpose: 'Instant liquidity & multi-app device upgrade',
    },
    {
      title: 'Gig Business Scale & Heavy Cargo Loan',
      amount: Math.min(Math.max(Math.round(monthlyIncome * 6), 50000), 250000),
      interestRate: rateFor(8.0),
      tenureMonths: 24,
      purpose: 'Commercial vehicle down payment & logistics tools',
    },
  ];

  return templates.map((t) => ({ ...t, source: 'system', status: 'available' }));
}

/** Step 5: Simulates Reverse-Auction Competitive Bids from Indian Lenders */
function generateReverseAuctionBids({ score, monthlyIncome }) {
  const baseRate = score >= 740 ? 7.8 : score >= 620 ? 10.5 : 14.2;
  const lenders = [
    { name: 'Bharat Gig Finance Ltd (RBI Reg: NBFC-IND-884210)', discount: 0.8, tenure: 12 },
    { name: 'Lendingkart Micro Trust (NBFC-MFI)', discount: 1.2, tenure: 18 },
    { name: 'Apex Microfinance Trust', discount: 0.5, tenure: 24 },
  ];

  const loanAmount = Math.round(monthlyIncome * 2.5);

  return lenders.map((l) => ({
    lenderName: l.name,
    bidAmount: loanAmount,
    offeredRate: round2(baseRate - l.discount),
    tenureMonths: l.tenure,
    estimatedDailyEMI: Math.round((loanAmount * (1 + (baseRate - l.discount)/100)) / (l.tenure * 30)),
    bidMatchedSecondsAgo: randInt(4, 48),
  }));
}

module.exports = {
  GIG_PLATFORMS,
  randInt,
  round2,
  generatePlatformData,
  generateWalletTransactions,
  generateSystemLoanOffers,
  generateReverseAuctionBids,
};
