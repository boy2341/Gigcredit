const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { moneyLimiter } = require('../middleware/rateLimiters');
const validate = require('../middleware/validators');
const { getWallet, getTransactions, addMoney, withdraw, simulateEscrowPayout, parseSMSAlert } = require('../controllers/walletController');

router.use(protect, authorize('worker'));

router.get('/me', getWallet);
router.get('/transactions', getTransactions);
router.post('/add-money', moneyLimiter, validate.walletAmount, validate.handleValidation, addMoney);
router.post('/withdraw', moneyLimiter, validate.walletAmount, validate.handleValidation, withdraw);
router.post('/simulate-payout', moneyLimiter, simulateEscrowPayout);
router.post('/parse-sms', parseSMSAlert);

module.exports = router;
