const Worker = require('../models/Worker');
const Lender = require('../models/Lender');
const Wallet = require('../models/Wallet');
const LoanOffer = require('../models/LoanOffer');
const generateToken = require('../utils/generateToken');
const { calculateGigScore, calculateMonthlyIncome } = require('../utils/gigScore');
const { generateSystemLoanOffers } = require('../utils/mockData');

// @desc  Register a worker or lender
// @route POST /api/auth/register
// @body  { role: 'worker'|'lender', name, email, password, phone?, institutionName? }
const register = async (req, res, next) => {
  try {
    const { role, name, email, password, phone, institutionName } = req.body;

    if (!role || !['worker', 'lender'].includes(role)) {
      return res.status(400).json({ success: false, message: "role must be 'worker' or 'lender'" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' });
    }

    if (role === 'worker') {
      const exists = await Worker.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(400).json({ success: false, message: 'A worker with that email already exists' });

      const worker = await Worker.create({
        name,
        email,
        password,
        phone,
        accountAgeMonths: 1,
        gigCreditScore: 300,
      });

      await Wallet.create({ worker: worker._id, balance: 0, transactions: [] });

      const token = generateToken(worker._id, 'worker');
      return res.status(201).json({ success: true, token, role: 'worker', user: worker.toSafeObject() });
    }

    // Lender
    const exists = await Lender.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: 'A lender with that email already exists' });

    const lender = await Lender.create({ name, email, password, phone, institutionName });
    const token = generateToken(lender._id, 'lender');
    return res.status(201).json({ success: true, token, role: 'lender', user: lender.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc  Login as worker or lender
// @route POST /api/auth/login
// @body  { role: 'worker'|'lender', email, password }
const login = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !['worker', 'lender'].includes(role)) {
      return res.status(400).json({ success: false, message: "role must be 'worker' or 'lender'" });
    }
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const Model = role === 'worker' ? Worker : Lender;
    const user = await Model.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, role);
    res.json({ success: true, token, role, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc  Get currently authenticated user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, role: req.role, user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
};

module.exports = { register, login, getMe };
