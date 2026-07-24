const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  listPlatforms,
  connectPlatform,
  disconnectPlatform,
  connectBank,
} = require('../controllers/workerController');

router.use(protect, authorize('worker'));

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/platforms', listPlatforms);
router.post('/platforms/connect', connectPlatform);
router.delete('/platforms/:platform', disconnectPlatform);
router.post('/bank/connect', connectBank);

module.exports = router;
