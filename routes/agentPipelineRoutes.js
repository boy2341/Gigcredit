const express = require('express');
const router = express.Router();
const { runPipeline, getLatestAudit, getBigDataAnalytics, queryCopilot } = require('../controllers/agentPipelineController');
const { protectOptional } = require('../middleware/auth');

router.post('/run-pipeline', protectOptional, runPipeline);
router.get('/latest-audit', protectOptional, getLatestAudit);
router.get('/bigdata-analytics', protectOptional, getBigDataAnalytics);
router.post('/copilot', protectOptional, queryCopilot);

module.exports = router;
