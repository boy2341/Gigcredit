const express = require('express');
const router = express.Router();
const { register, login, getMe, getDemoAccounts, switchDemoAccount, workerOTPLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiters');
const validate = require('../middleware/validators');

router.post('/register', authLimiter, validate.register, validate.handleValidation, register);
router.post('/login', authLimiter, validate.login, validate.handleValidation, login);
router.post('/worker-otp-login', otpLimiter, validate.workerOTPLogin, validate.handleValidation, workerOTPLogin);
router.get('/me', protect, getMe);
router.get('/demo-accounts', getDemoAccounts);
router.post('/switch-demo', authLimiter, switchDemoAccount);

module.exports = router;
