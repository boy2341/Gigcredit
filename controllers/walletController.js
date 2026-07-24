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

module.exports = { getWallet, getTransactions, addMoney, withdraw, getOrCreateWallet };
