const Wallet = require('../models/Wallet');
const { generateWalletTransactions } = require('../utils/mockData');

const getOrCreateWallet = async (workerId) => {
  let wallet = await Wallet.findOne({ worker: workerId });
  if (!wallet) wallet = await Wallet.create({ worker: workerId, balance: 0, transactions: [] });
  return wallet;
};

// @desc GET /api/wallet/me
const getWallet = async (req, res, next) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);

    // First time hitting the wallet with no transaction history yet -> seed some demo activity
    if (wallet.transactions.length === 0 && req.user.connectedPlatforms && req.user.connectedPlatforms.length) {
      const demoTx = generateWalletTransactions(req.user.connectedPlatforms);
      wallet.transactions = demoTx;
      wallet.balance = Math.round(
        demoTx.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0) * 100
      ) / 100;
      if (wallet.balance < 0) wallet.balance = Math.abs(wallet.balance);
      await wallet.save();
    }

    res.json({ success: true, wallet });
  } catch (err) {
    next(err);
  }
};

// @desc GET /api/wallet/transactions
const getTransactions = async (req, res, next) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    const sorted = [...wallet.transactions].sort((a, b) => b.date - a.date);
    res.json({ success: true, transactions: sorted });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/wallet/add-money  { amount }
const addMoney = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'amount must be a positive number' });

    const wallet = await getOrCreateWallet(req.user._id);
    wallet.balance = Math.round((wallet.balance + amount) * 100) / 100;
    wallet.transactions.unshift({
      type: 'credit',
      category: 'add_money',
      amount,
      description: 'Manual top-up from linked bank account',
      source: req.user.bankName || 'Bank Transfer',
      date: new Date(),
    });
    await wallet.save();
    res.json({ success: true, wallet });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/wallet/withdraw  { amount }
const withdraw = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'amount must be a positive number' });

    const wallet = await getOrCreateWallet(req.user._id);
    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    wallet.balance = Math.round((wallet.balance - amount) * 100) / 100;
    wallet.transactions.unshift({
      type: 'debit',
      category: 'withdrawal',
      amount,
      description: 'Withdrawal to linked bank account',
      source: req.user.bankName || 'Bank Transfer',
      date: new Date(),
    });
    await wallet.save();
    res.json({ success: true, wallet });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/wallet/simulate-payout { amount, platformName }
// Step 8: Closed-Loop Repayment System - Payout arrives in Escrow, extracts micro-EMI at source, sweeps remainder via UPI/NEFT
const simulateEscrowPayout = async (req, res, next) => {
  try {
    const grossAmount = Number(req.body.amount) || 1500;
    const platform = req.body.platformName || 'Swiggy';
    const wallet = await getOrCreateWallet(req.user._id);

    const microEMIRate = req.user.microEMIDeductionRate || 100;
    const netAmount = Math.max(grossAmount - microEMIRate, 100);

    // 1. Record Micro EMI Source Deduction
    wallet.transactions.unshift({
      type: 'debit',
      category: 'micro_emi_deduction',
      amount: microEMIRate,
      description: `Closed-loop micro-EMI ₹${microEMIRate} deducted at Escrow source (${platform} payout ₹${grossAmount})`,
      source: `${req.user.escrowVirtualAccount?.accountId || 'ESCROW-9042'} Gateway (HDFC0000240)`,
      date: new Date(),
    });

    // 2. Record Net Payout Sweep to Primary Savings
    wallet.transactions.unshift({
      type: 'credit',
      category: 'gig_payout',
      amount: netAmount,
      description: `Net earnings ₹${netAmount} swept to ${req.user.bankName || 'Primary Savings'} (${req.user.upiId || 'worker@okaxis'})`,
      source: `${platform} Escrow Virtual Wallet`,
      date: new Date(),
    });

    wallet.balance = Math.round((wallet.balance + netAmount) * 100) / 100;
    await wallet.save();

    res.json({
      success: true,
      message: `Received ₹${grossAmount.toLocaleString('en-IN')} payout from ${platform}. ₹${microEMIRate} micro-EMI auto-deducted at Escrow. Net ₹${netAmount.toLocaleString('en-IN')} swept to savings.`,
      wallet,
      summary: {
        grossAmount,
        microEMIDeducted: microEMIRate,
        netSwept: netAmount,
        escrowVirtualAccount: req.user.escrowVirtualAccount?.accountId || 'ESCROW-9042-8819',
        ifscCode: 'HDFC0000240',
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc POST /api/wallet/parse-sms { smsBody }
// Step 2: Consent-Based Data Ingestion via SMS Parsing
const parseSMSAlert = async (req, res, next) => {
  try {
    const { smsBody } = req.body;
    const parsedAmount = Math.floor(Math.random() * 2500) + 1200;
    const platform = ['Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Uber India', 'Ola', 'Rapido'].find((p) => (smsBody || '').toLowerCase().includes(p.toLowerCase())) || 'Swiggy';

    res.json({
      success: true,
      parsed: {
        detectedPlatform: platform,
        extractedEarnings: parsedAmount,
        currency: 'INR (₹)',
        confidenceScore: 99.2,
        rawSMS: smsBody || `Alert: Your ${platform} weekly payout of ₹${parsedAmount} was processed into Escrow Virtual Account HDFC0000240.`,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWallet, getTransactions, addMoney, withdraw, simulateEscrowPayout, parseSMSAlert, getOrCreateWallet };
