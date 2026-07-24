const Worker = require('../models/Worker');
const Loan = require('../models/Loan');
const { calculateMonthlyIncome, calculateLoanEligibility } = require('../utils/gigScore');

// @desc GET /api/lenders/me
const getProfile = async (req, res) => {
  res.json({ success: true, lender: req.user.toSafeObject() });
};

// @desc PUT /api/lenders/me
const updateProfile = async (req, res, next) => {
  try {
    const editable = ['name', 'phone', 'institutionName'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    await req.user.save();
    res.json({ success: true, lender: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc GET /api/lenders/workers
// Lists workers ("applicants") a lender can review/offer loans to, with pagination + search
const listWorkers = async (req, res, next) => {
  try {
    const { search = '', minScore = 0, page = 1, limit = 20 } = req.query;

    const query = { gigCreditScore: { $gte: Number(minScore) || 0 } };
    if (search) {
      query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    }

    const workers = await Worker.find(query)
      .select('-password')
      .sort({ gigCreditScore: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Worker.countDocuments(query);

    const enriched = workers.map((w) => {
      const monthlyIncome = calculateMonthlyIncome(w.connectedPlatforms);
      return {
        ...w.toObject(),
        monthlyIncome,
        loanEligibility: calculateLoanEligibility(w.gigCreditScore, monthlyIncome),
      };
    });

    res.json({ success: true, count: enriched.length, total, page: Number(page), workers: enriched });
  } catch (err) {
    next(err);
  }
};

// @desc GET /api/lenders/workers/:id
const getWorkerDetail = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-password');
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

    const monthlyIncome = calculateMonthlyIncome(worker.connectedPlatforms);
    const loans = await Loan.find({ worker: worker._id }).populate('lender', 'name institutionName');

    res.json({
      success: true,
      worker: {
        ...worker.toObject(),
        monthlyIncome,
        loanEligibility: calculateLoanEligibility(worker.gigCreditScore, monthlyIncome),
      },
      loans,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, listWorkers, getWorkerDetail };
