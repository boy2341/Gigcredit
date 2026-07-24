const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getWorkerDashboard, getLenderDashboard } = require('../controllers/dashboardController');

router.get('/worker', protect, authorize('worker'), getWorkerDashboard);
router.get('/lender', protect, authorize('lender'), getLenderDashboard);

module.exports = router;
