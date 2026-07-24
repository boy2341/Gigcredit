const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getWorkerLoans, getLenderLoans, getLoanById, repayLoan } = require('../controllers/loanController');

router.get('/worker', protect, authorize('worker'), getWorkerLoans);
router.post('/:id/repay', protect, authorize('worker'), repayLoan);

router.get('/lender', protect, authorize('lender'), getLenderLoans);

router.get('/:id', protect, getLoanById);

module.exports = router;
