const GIG_PLATFORMS = ['Swiggy', 'Uber', 'Blinkit', 'Rapido', 'Zepto', 'Amazon Flex', 'Porter'];

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const round2 = (n) => Math.round(n * 100) / 100;

/** Generates realistic-looking demo stats for a single connected gig platform */
function generatePlatformData(platform) {
  return {
    platform,
    connectedAt: new Date(),
    monthlyEarnings: round2(rand(150, 950)),
    rating: round2(rand(3.6, 5.0)),
    completedJobs: randInt(40, 1200),
    cancellationRate: round2(rand(0, 9)),
  };
}

/** Generates a handful of demo wallet transactions to make the wallet feel "lived in" */
function generateWalletTransactions(platforms = []) {
  const sources = platforms.length ? platforms.map((p) => p.platform) : GIG_PLATFORMS.slice(0, 3);
  const descriptions = {
    gig_payout: (source) => `Weekly payout from ${source}`,
    withdrawal: () => 'Withdrawal to linked bank account',
    add_money: () => 'Manual top-up',
  };

  const count = randInt(5, 9);
  const transactions = [];
  let daysAgo = randInt(1, 3);

  for (let i = 0; i < count; i += 1) {
    const isPayout = Math.random() < 0.75;
    const source = pick(sources);
    const amount = isPayout ? round2(rand(30, 220)) : round2(rand(50, 400));
    transactions.push({
      type: isPayout ? 'credit' : 'debit',
      category: isPayout ? 'gig_payout' : 'withdrawal',
      amount,
      description: isPayout ? descriptions.gig_payout(source) : descriptions.withdrawal(),
      source: isPayout ? source : 'Bank Transfer',
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
    daysAgo += randInt(1, 4);
  }

  return transactions.sort((a, b) => b.date - a.date);
}

/** Generates 3 pre-approved / marketplace-style loan offers scaled to the worker's score */
function generateSystemLoanOffers({ score, monthlyIncome }) {
  const tier = score >= 750 ? 'prime' : score >= 600 ? 'standard' : 'starter';

  const rateFor = (base) => {
    if (tier === 'prime') return round2(base - 2.5);
    if (tier === 'standard') return round2(base);
    return round2(base + 4);
  };

  const templates = [
    {
      title: 'Vehicle Repair Loan',
      amount: Math.min(Math.max(Math.round(monthlyIncome * 4), 500), 6000),
      interestRate: rateFor(10.5),
      tenureMonths: 24,
      purpose: 'Vehicle maintenance & repair',
    },
    {
      title: 'Quick Cash Advance',
      amount: Math.min(Math.max(Math.round(monthlyIncome * 1.2), 300), 2000),
      interestRate: rateFor(14),
      tenureMonths: 6,
      purpose: 'Short-term cash flow',
    },
    {
      title: 'Business Expansion Loan',
      amount: Math.min(Math.max(Math.round(monthlyIncome * 8), 2000), 15000),
      interestRate: rateFor(8.5),
      tenureMonths: 36,
      purpose: 'Growing your gig business',
    },
  ];

  return templates.map((t) => ({ ...t, source: 'system', status: 'available' }));
}

module.exports = {
  GIG_PLATFORMS,
  randInt,
  round2,
  generatePlatformData,
  generateWalletTransactions,
  generateSystemLoanOffers,
};
