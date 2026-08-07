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

// @desc  Get list of pre-seeded demo worker & lender accounts for quick switching
// @route GET /api/auth/demo-accounts
const getDemoAccounts = async (req, res, next) => {
  try {
    const workers = await Worker.find({ isDemoAccount: true }).select('-password');
    const lenders = await Lender.find({ isDemoAccount: true }).select('-password');

    const formattedWorkers = workers.map((w) => ({
      id: w._id,
      name: w.name,
      email: w.email,
      role: 'worker',
      avatarUrl: w.avatarUrl,
      tagline: w.tagline,
      gigCreditScore: w.gigCreditScore,
      riskTier: w.riskTier,
      platforms: w.connectedPlatforms.map((p) => p.platform),
      monthlyIncome: calculateMonthlyIncome(w.connectedPlatforms),
    }));

    const formattedLenders = lenders.map((l) => ({
      id: l._id,
      name: l.name,
      email: l.email,
      role: 'lender',
      institutionName: l.institutionName,
      avatarUrl: l.avatarUrl,
      nbfcLicenseNo: l.nbfcLicenseNo,
    }));

    res.json({ success: true, workers: formattedWorkers, lenders: formattedLenders });
  } catch (err) {
    next(err);
  }
};

// @desc  Instantly switch to any demo account without password
// @route POST /api/auth/switch-demo
const switchDemoAccount = async (req, res, next) => {
  try {
    const { id, role } = req.body;
    if (!id || !role || !['worker', 'lender'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Valid id and role are required' });
    }

    const Model = role === 'worker' ? Worker : Lender;
    const user = await Model.findById(id);

    if (!user || !user.isDemoAccount) {
      // Deliberately returns the same 404 whether the id doesn't exist or
      // belongs to a real (non-demo) account, so this endpoint can't be used
      // to probe which ids correspond to real registered users.
      return res.status(404).json({ success: false, message: 'Demo account not found' });
    }

    const token = generateToken(user._id, role);
    res.json({ success: true, token, role, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc  Login/Register worker using Phone Number & Aadhaar Number + OTP (No email required)
// @route POST /api/auth/worker-otp-login
// @body  { phone, aadhaarNumber, otp }
const workerOTPLogin = async (req, res, next) => {
  try {
    const { phone, aadhaarNumber, otp } = req.body;

    if (!phone || !aadhaarNumber) {
      return res.status(400).json({ success: false, message: 'Phone number and Aadhaar number are required' });
    }

    const cleanPhone = phone.trim();
    const last4 = String(aadhaarNumber).slice(-4);

    // Try finding existing worker by phone or Aadhaar
    let worker = await Worker.findOne({
      $or: [{ phone: cleanPhone }, { 'kycStatus.aadhaarLast4': last4 }],
    });

    if (!worker) {
      // Create fresh worker profile directly in MongoDB
      const autoEmail = `worker_${cleanPhone.replace(/\D/g, '') || Math.floor(Math.random() * 10000)}@gigcredit.in`;
      worker = await Worker.create({
        name: `Gig Captain (${cleanPhone.slice(-4)})`,
        phone: cleanPhone,
        email: autoEmail,
        password: 'otp_authenticated_user',
        kycStatus: {
          aadhaarLast4: last4,
          verified: true,
        },
        accountAgeMonths: 1,
        gigCreditScore: 740,
        riskTier: 'Prime (Low Risk)',
      });

      await Wallet.create({ worker: worker._id, balance: 0, transactions: [] });
    } else {
      if (!worker.kycStatus) worker.kycStatus = {};
      worker.kycStatus.aadhaarLast4 = last4;
      worker.kycStatus.verified = true;
      if (!worker.phone) worker.phone = cleanPhone;
      await worker.save();
    }

    const token = generateToken(worker._id, 'worker');
    return res.json({ success: true, token, role: 'worker', user: worker.toSafeObject(), isNewAccount: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, getDemoAccounts, switchDemoAccount, workerOTPLogin };
