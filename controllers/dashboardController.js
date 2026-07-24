const Worker = require('../models/Worker');
const Lender = require('../models/Lender');
const Wallet = require('../models/Wallet');
const Loan = require('../models/Loan');
const LoanOffer = require('../models/LoanOffer');
const { calculateMonthlyIncome, calculateLoanEligibility } = require('../utils/gigScore');

// @desc GET /api/dashboard/worker
// Returns everything the worker dashboard UI needs in one call:
// gig score, monthly income, wallet balance, loan eligibility, platforms, offers
const getWorkerDashboard = async (req, res, next) => {
  try {
    const worker = req.user;
    const wallet = await Wallet.findOne({ worker: worker._id });
    const monthlyIncome = calculateMonthlyIncome(worker.connectedPlatforms);
    const loanEligibility = calculateLoanEligibility(worker.gigCreditScore, monthlyIncome);

    const offers = await LoanOffer.find({ worker: worker._id, status: 'available' }).sort({ createdAt: -1 });
    const activeLoans = await Loan.find({ worker: worker._id, status: 'active' }).populate('lender', 'name institutionName');

    res.json({
      success: true,
      dashboard: {
        name: worker.name,
        gigCreditScore: worker.gigCreditScore,
        scoreBreakdown: worker.scoreBreakdown,
        riskTier: worker.riskTier,
        scoreDelta: worker.connectedPlatforms.length ? Math.max(5, Math.round(worker.gigCreditScore * 0.02)) : 0,
        monthlyIncome,
        walletBalance: wallet ? wallet.balance : 0,
        loanEligibility,
        bankConnected: worker.bankConnected,
        connectedPlatforms: worker.connectedPlatforms,
        loanOffers: offers,
        activeLoans,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc GET /api/dashboard/lender
// Returns portfolio KPIs: total applicants, money lent, active loans, collection rate
const getLenderDashboard = async (req, res, next) => {
  try {
    const lender = req.user;

    const totalApplicants = await Worker.countDocuments();
    const lenderLoans = await Loan.find({ lender: lender._id });

    const moneyLent = lenderLoans.reduce((sum, l) => sum + l.principal, 0);
    const activeLoans = lenderLoans.filter((l) => l.status === 'active');
    const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.outstandingBalance, 0);
    const totalRepaid = lenderLoans.reduce((sum, l) => sum + l.amountRepaid, 0);
    const totalDue = lenderLoans.reduce((sum, l) => sum + l.amountRepaid + l.outstandingBalance, 0);
    const collectionRate = totalDue > 0 ? Math.round((totalRepaid / totalDue) * 1000) / 10 : 100;

    res.json({
      success: true,
      dashboard: {
        institutionName: lender.institutionName,
        totalApplicants,
        moneyLent,
        activeLoansCount: activeLoans.length,
        totalOutstanding,
        collectionRate,
        activePortfolioValue: totalOutstanding,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWorkerDashboard, getLenderDashboard };
