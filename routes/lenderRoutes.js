const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getProfile, updateProfile, listWorkers, getWorkerDetail } = require('../controllers/lenderController');

router.use(protect, authorize('lender'));

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/workers', listWorkers);
router.get('/workers/:id', getWorkerDetail);

module.exports = router;
