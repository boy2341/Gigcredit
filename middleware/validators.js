const { body, validationResult } = require('express-validator');

// Drop this after any validator chain in a route to actually enforce it and
// return a consistent 400 shape. Usage:
//   router.post('/register', validate.register, handleValidation, register);
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

const register = [
  body('role').isIn(['worker', 'lender']).withMessage("role must be 'worker' or 'lender'"),
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('name must be between 2 and 100 characters'),
  body('email').trim().isEmail().withMessage('a valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6, max: 128 }).withMessage('password must be at least 6 characters'),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 20 }).withMessage('phone number is too long'),
  body('institutionName').optional({ checkFalsy: true }).trim().isLength({ max: 150 }).withMessage('institutionName is too long'),
];

const login = [
  body('role').isIn(['worker', 'lender']).withMessage("role must be 'worker' or 'lender'"),
  body('email').trim().isEmail().withMessage('a valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('password is required'),
];

const workerOTPLogin = [
  body('phone')
    .trim()
    .customSanitizer((v) => v.replace(/[\s\-+]/g, '').replace(/^91/, ''))
    .matches(INDIAN_PHONE_REGEX)
    .withMessage('a valid 10-digit Indian mobile number is required'),
  body('aadhaarNumber')
    .trim()
    .customSanitizer((v) => v.replace(/\s/g, ''))
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('aadhaarNumber must be exactly 12 digits'),
  body('otp').trim().isLength({ min: 4, max: 8 }).withMessage('a valid OTP is required'),
];

const verifyAadhaarOTP = [
  body('phone').trim().isLength({ min: 5, max: 20 }).withMessage('a valid phone number is required'),
  body('aadhaarNumber')
    .trim()
    .customSanitizer((v) => v.replace(/\s/g, ''))
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('aadhaarNumber must be exactly 12 digits'),
  body('otp').trim().isLength({ min: 4, max: 8 }).withMessage('a valid OTP is required'),
];

const updateWorkerProfile = [
  body('name').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 100 }),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 20 }),
  body('city').optional({ checkFalsy: true }).trim().isLength({ max: 60 }),
  body('address').optional({ checkFalsy: true }).trim().isLength({ max: 300 }),
  body('dateOfBirth').optional({ checkFalsy: true }).isISO8601().withMessage('dateOfBirth must be a valid date'),
  body('panNumber').optional({ checkFalsy: true }).trim().isLength({ max: 20 }),
  body('aadhaarLast4').optional({ checkFalsy: true }).trim().isLength({ min: 4, max: 4 }).isNumeric(),
];

const connectPlatform = [body('platform').trim().notEmpty().withMessage('platform is required')];

const connectBank = [
  body('bankName').trim().notEmpty().isLength({ max: 100 }).withMessage('bankName is required'),
  body('accountNumber').trim().notEmpty().isLength({ min: 4, max: 30 }).withMessage('a valid accountNumber is required'),
];

const walletAmount = [
  body('amount')
    .isFloat({ gt: 0, lt: 1000000 })
    .withMessage('amount must be a positive number under ₹10,00,000'),
];

const createOffer = [
  body('workerId').trim().isMongoId().withMessage('a valid workerId is required'),
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('title must be between 2 and 120 characters'),
  body('amount').isFloat({ gt: 0, lt: 1000000 }).withMessage('amount must be a positive number under ₹10,00,000'),
  body('interestRate').isFloat({ gt: 0, lt: 100 }).withMessage('interestRate must be between 0 and 100'),
  body('tenureMonths').isInt({ gt: 0, lt: 60 }).withMessage('tenureMonths must be between 1 and 59'),
];

module.exports = {
  handleValidation,
  register,
  login,
  workerOTPLogin,
  verifyAadhaarOTP,
  updateWorkerProfile,
  connectPlatform,
  connectBank,
  walletAmount,
  createOffer,
};
