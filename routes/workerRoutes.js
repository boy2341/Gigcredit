const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { otpLimiter } = require('../middleware/rateLimiters');
const validate = require('../middleware/validators');
const {
  getProfile,
  updateProfile,
  listPlatforms,
  connectPlatform,
  disconnectPlatform,
  connectBank,
  fetchAccountAggregatorData,
  verifyAadhaarOTP,
  underwriteFullAnalysis,
} = require('../controllers/workerController');

router.use(protect, authorize('worker'));

router.get('/me', getProfile);
router.put('/me', validate.updateWorkerProfile, validate.handleValidation, updateProfile);
router.get('/platforms', listPlatforms);
router.post('/platforms/connect', validate.connectPlatform, validate.handleValidation, connectPlatform);
router.delete('/platforms/:platform', disconnectPlatform);
router.post('/bank/connect', validate.connectBank, validate.handleValidation, connectBank);
router.post('/aa/fetch', fetchAccountAggregatorData);
router.post('/verify-aadhaar-otp', otpLimiter, validate.verifyAadhaarOTP, validate.handleValidation, verifyAadhaarOTP);
router.post('/underwrite-full-analysis', underwriteFullAnalysis);

module.exports = router;
