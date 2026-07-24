const express = require('express');
const router = express.Router();
const { register, login, getMe, getDemoAccounts, switchDemoAccount, workerOTPLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/worker-otp-login', workerOTPLogin);
router.get('/me', protect, getMe);
router.get('/demo-accounts', getDemoAccounts);
router.post('/switch-demo', switchDemoAccount);

module.exports = router;
