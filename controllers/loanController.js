const Loan = require('../models/Loan');
const { getOrCreateWallet } = require('./walletController');

// @desc GET /api/loans/worker - all loans for the logged in worker
const getWorkerLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({ worker: req.user._id }).populate('lender', 'name institutionName').sort({ createdAt: -1 });
    res.json({ success: true, loans });
  } catch (err) {
    next(err);
  }
};

// @desc GET /api/loans/lender - portfolio of loans issued by the logged in lender
const getLenderLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({ lender: req.user._id }).populate('worker', 'name email gigCreditScore').sort({ createdAt: -1 });
    res.json({ success: true, loans });
  } catch (err) {
    next(err);
  }
};

// @desc GET /api/loans/:id
const getLoanById = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('lender', 'name institutionName').populate('worker', 'name email gigCreditScore');
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });

    const isOwner = req.role === 'worker' && String(loan.worker._id) === String(req.user._id);
    const isLender = req.role === 'lender' && loan.lender && String(loan.lender._id) === String(req.user._id);
    if (!isOwner && !isLender) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this loan' });
    }

    res.json({ success: true, loan });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/loans/:id/repay  (worker)  { amount }
// Simulates a repayment: debits the wallet, reduces outstanding balance, logs a transaction
const repayLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    if (String(loan.worker) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'This loan does not belong to you' });
    }
    if (loan.status !== 'active') {
      return res.status(400).json({ success: false, message: `Loan is already ${loan.status}` });
    }

    const amount = Number(req.body.amount) || loan.monthlyEMI;
    if (amount <= 0) return res.status(400).json({ success: false, message: 'amount must be positive' });

    const wallet = await getOrCreateWallet(req.user._id);
    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance for this repayment' });
    }

    const payment = Math.min(amount, loan.outstandingBalance);

    wallet.balance = Math.round((wallet.balance - payment) * 100) / 100;
    wallet.transactions.unshift({
      type: 'debit',
      category: 'repayment',
      amount: payment,
      description: `Repayment for ${loan.title}`,
      source: 'GigCredit Wallet',
      date: new Date(),
    });
    await wallet.save();

    loan.outstandingBalance = Math.round((loan.outstandingBalance - payment) * 100) / 100;
    loan.amountRepaid = Math.round((loan.amountRepaid + payment) * 100) / 100;
    loan.repayments.push({ amount: payment, date: new Date(), status: 'paid' });

    if (loan.outstandingBalance <= 0) {
      loan.outstandingBalance = 0;
      loan.status = 'completed';
      loan.nextDueDate = null;
    } else {
      const next = new Date(loan.nextDueDate || Date.now());
      next.setMonth(next.getMonth() + 1);
      loan.nextDueDate = next;
    }

    await loan.save();

    res.json({ success: true, loan, wallet });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWorkerLoans, getLenderLoans, getLoanById, repayLoan };
