const LoanOffer = require('../models/LoanOffer');
const Loan = require('../models/Loan');
const Worker = require('../models/Worker');
const { getOrCreateWallet } = require('./walletController');

// @desc GET /api/offers/worker
// All offers (system pre-approved + lender-issued) available to the logged in worker
const getOffersForWorker = async (req, res, next) => {
  try {
    const offers = await LoanOffer.find({ worker: req.user._id })
      .populate('lender', 'name institutionName')
      .sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/offers  (lender)
// @body { workerId, title, amount, interestRate, tenureMonths, purpose? }
const createOffer = async (req, res, next) => {
  try {
    const { workerId, title, amount, interestRate, tenureMonths, purpose } = req.body;

    if (!workerId || !title || !amount || !interestRate || !tenureMonths) {
      return res.status(400).json({
        success: false,
        message: 'workerId, title, amount, interestRate and tenureMonths are required',
      });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

    const offer = await LoanOffer.create({
      title,
      worker: workerId,
      lender: req.user._id,
      source: 'lender',
      amount,
      interestRate,
      tenureMonths,
      purpose: purpose || 'General purpose',
      status: 'available',
    });

    res.status(201).json({ success: true, offer });
  } catch (err) {
    next(err);
  }
};

// @desc GET /api/offers/lender  - offers this lender has issued
const getOffersByLender = async (req, res, next) => {
  try {
    const offers = await LoanOffer.find({ lender: req.user._id }).populate('worker', 'name email gigCreditScore').sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (err) {
    next(err);
  }
};

const emiFor = (principal, annualRatePct, months) => {
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return Math.round((principal / months) * 100) / 100;
  const emi = (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
  return Math.round(emi * 100) / 100;
};

// @desc POST /api/offers/:id/accept  (worker)
// Accepting an offer disburses funds into the worker's wallet and creates a Loan record
const acceptOffer = async (req, res, next) => {
  try {
    const offer = await LoanOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    if (String(offer.worker) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'This offer does not belong to you' });
    }
    if (offer.status !== 'available') {
      return res.status(400).json({ success: false, message: `Offer is already ${offer.status}` });
    }

    const monthlyEMI = emiFor(offer.amount, offer.interestRate, offer.tenureMonths);
    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    const loan = await Loan.create({
      worker: req.user._id,
      lender: offer.lender,
      offer: offer._id,
      title: offer.title,
      principal: offer.amount,
      interestRate: offer.interestRate,
      tenureMonths: offer.tenureMonths,
      monthlyEMI,
      outstandingBalance: offer.amount,
      status: 'active',
      nextDueDate,
    });

    offer.status = 'accepted';
    await offer.save();

    // Disburse funds into the worker's wallet
    const wallet = await getOrCreateWallet(req.user._id);
    wallet.balance = Math.round((wallet.balance + offer.amount) * 100) / 100;
    wallet.transactions.unshift({
      type: 'credit',
      category: 'loan_disbursement',
      amount: offer.amount,
      description: `${offer.title} disbursed`,
      source: offer.lender ? 'Lender' : 'GigCredit Capital',
      date: new Date(),
    });
    await wallet.save();

    res.json({ success: true, loan, wallet });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/offers/:id/reject (worker)
const rejectOffer = async (req, res, next) => {
  try {
    const offer = await LoanOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    if (String(offer.worker) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'This offer does not belong to you' });
    }
    if (offer.status !== 'available') {
      return res.status(400).json({ success: false, message: `Offer is already ${offer.status}` });
    }
    offer.status = 'rejected';
    await offer.save();
    res.json({ success: true, offer });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/offers/request-bids (worker)
// Step 5: Reverse-Auction Compete Bidding - NBFCs bid programmatically matching risk profile in < 60 seconds
const requestReverseAuctionBids = async (req, res, next) => {
  try {
    const worker = req.user;
    const { generateReverseAuctionBids } = require('../utils/mockData');
    const { calculateMonthlyIncome } = require('../utils/gigScore');

    const monthlyIncome = calculateMonthlyIncome(worker.connectedPlatforms || []);
    const bids = generateReverseAuctionBids({ score: worker.gigCreditScore || 700, monthlyIncome: monthlyIncome || 1200 });

    // Save one bid as an official available LoanOffer
    const winningBid = bids[0];
    const newOffer = await LoanOffer.create({
      title: `${winningBid.lenderName} Reverse-Auction Match`,
      worker: worker._id,
      source: 'system',
      amount: winningBid.bidAmount,
      interestRate: winningBid.offeredRate,
      tenureMonths: winningBid.tenureMonths,
      purpose: 'Competitive auction rate unlocked via Escrow guarantee',
      status: 'available',
    });

    res.json({
      success: true,
      message: `Reverse auction complete! 3 NBFC lenders submitted bids in 24 seconds. Lowest rate: ${winningBid.offeredRate}%.`,
      bids,
      unlockedOffer: newOffer,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOffersForWorker, createOffer, getOffersByLender, acceptOffer, rejectOffer, requestReverseAuctionBids };
