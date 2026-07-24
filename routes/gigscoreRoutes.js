const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getMyScore, recalculate } = require('../controllers/gigscoreController');

router.use(protect, authorize('worker'));

router.get('/me', getMyScore);
router.post('/recalculate', recalculate);

module.exports = router;
