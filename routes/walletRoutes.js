const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getWallet, getTransactions, addMoney, withdraw } = require('../controllers/walletController');

router.use(protect, authorize('worker'));

router.get('/me', getWallet);
router.get('/transactions', getTransactions);
router.post('/add-money', addMoney);
router.post('/withdraw', withdraw);

module.exports = router;
