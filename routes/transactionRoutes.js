const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getTransactions } = require('../controllers/transactionController');

router.get('/', protect, authorize('worker'), getTransactions);

module.exports = router;
