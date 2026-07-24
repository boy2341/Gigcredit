/**
 * ============================================================================
 * GigCredit - Infrastructure Layer & Underwriting Marketplace for Gig Workers
 * ============================================================================
 * 
 * package.json configuration:
 * {
 *   "name": "gigcredit-backend",
 *   "version": "1.0.0",
 *   "description": "GigCredit - Infrastructure layer & underwriting marketplace for decentralized gig workers",
 *   "main": "server.js",
 *   "scripts": {
 *     "start": "node server.js",
 *     "dev": "nodemon server.js"
 *   },
 *   "dependencies": {
 *     "cors": "^2.8.5",
 *     "dotenv": "^16.6.1",
 *     "express": "^4.19.2"
 *   }
 * }
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

// Optional DB connector for local environment
let connectDB;
try {
  connectDB = require('./config/db');
} catch (e) {
  // In-memory fallback mode for hackathons
}

const app = express();

// ============================================================================
// CORE MIDDLEWARE & IN-MEMORY STATE LEDGER
// ============================================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files for local demonstration
app.use(express.static(path.join(__dirname, 'frontend')));

/**
 * In-memory ledger simulating a live database state for frictionless hackathon deployments.
 */
const mockLedger = {
  syncLogs: [],
  scoreMatrix: {
    score: 742,
    maxScore: 900,
    status: 'EXCELLENT',
    trend: '+14 pts this week',
    aggregatedEarnings: {
      total: 14250,
      breakdown: [
        { platform: 'Uber', amount: 6200 },
        { platform: 'Swiggy', amount: 5050 },
        { platform: 'Blinkit', amount: 3000 },
      ],
    },
    behavioralMetrics: [
      '98.4% Ride Fulfillment (Uber) [+8 pts]',
      'Low Order Cancellation (Zomato) [+5 pts]',
      '30-Day Multi-Platform Active Continuity [+12 pts]',
    ],
  },
  withdrawals: [],
};

// Connect to MongoDB if available
if (typeof connectDB === 'function') {
  connectDB().catch(() => console.log('[DB] Running in-memory ledger mode.'));
}

// ============================================================================
// 0. HEALTH CHECK ENDPOINT
// ============================================================================
/**
 * @route   GET /
 * @desc    Root health check endpoint for cloud platform deployments (e.g. Render, Railway)
 * @access  Public
 */
app.get('/', (req, res) => {
  // If request accepts HTML, serve frontend login.html; otherwise return JSON health status
  if (req.accepts('html') && !req.xhr) {
    return res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
  }
  res.status(200).json({ status: 'healthy' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================================================
// 1. THE INTAKE ENDPOINT (/api/sync)
// ============================================================================
/**
 * @route   POST /api/sync
 * @desc    Triggered when a worker clicks "Connect Account" via Account Aggregator and SMS rails.
 * @payload { phoneNumber: string }
 * @access  Public
 */
app.post('/api/sync', (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'phoneNumber is required and must be a valid string.',
      });
    }

    // Clean phone string (remove spaces, hyphens, and +91 prefix)
    const cleanedPhone = phoneNumber.replace(/[\s\-\+]/g, '').replace(/^91/, '');

    // Validate 10-digit Indian standard phone number (starts with 6-9)
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanedPhone)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PHONE_NUMBER',
        message: 'Please provide a valid 10-digit Indian mobile number (e.g., 9876543210).',
      });
    }

    const transactionToken = `TOKEN-AA-FINVU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // Record in in-memory state ledger
    mockLedger.syncLogs.push({ phoneNumber: cleanedPhone, transactionToken, timestamp });

    return res.status(200).json({
      success: true,
      transactionToken,
      timestamp,
      message: 'Consent-based SMS parsing engine and AA banking rails successfully initialized.',
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 2. THE ENGINE ENDPOINT (/api/score)
// ============================================================================
/**
 * @route   GET /api/score
 * @desc    Fetches the holistic underwriting matrix for the dashboard view.
 * @access  Public
 */
app.get('/api/score', (req, res, next) => {
  try {
    return res.status(200).json(mockLedger.scoreMatrix);
  } catch (err) {
    next(err);
  }
});

// Support POST /api/score for flex clients
app.post('/api/score', (req, res, next) => {
  try {
    return res.status(200).json(mockLedger.scoreMatrix);
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 3. THE ESCROW ENDPOINT (/api/withdraw)
// ============================================================================
/**
 * @route   POST /api/withdraw
 * @desc    Simulates drawing cash from the available credit line & calculates daily micro-EMI.
 * @payload { amountRequested: number }
 * @access  Public
 */
app.post('/api/withdraw', (req, res, next) => {
  try {
    const { amountRequested } = req.body;

    if (
      amountRequested === undefined ||
      amountRequested === null ||
      typeof amountRequested !== 'number' ||
      !Number.isInteger(amountRequested) ||
      amountRequested <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_AMOUNT',
        message: 'amountRequested must be a positive integer.',
      });
    }

    const MAXIMUM_CAP = 4500;
    if (amountRequested > MAXIMUM_CAP) {
      return res.status(400).json({
        success: false,
        error: 'EXCEEDS_MAXIMUM_CAP',
        message: `amountRequested cannot exceed the maximum credit limit of ₹${MAXIMUM_CAP}.`,
      });
    }

    // Programmatic daily micro-EMI calculation formula:
    // Formula: Round up ((amountRequested / 10 days) * 1.03 risk factor)
    const dailyAutoDeductAmount = Math.ceil((amountRequested / 10) * 1.03);

    const transactionId = `TXN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const record = {
      transactionId,
      status: 'ACTIVE_ESCROW',
      amountDisbursed: amountRequested,
      dailyAutoDeductAmount,
      timestamp,
    };

    mockLedger.withdrawals.push(record);

    return res.status(200).json({
      success: true,
      transactionId,
      status: 'ACTIVE_ESCROW',
      amountDisbursed: amountRequested,
      dailyAutoDeductAmount,
      message: `Cash withdrawal of ₹${amountRequested} approved. ₹${dailyAutoDeductAmount} will be automatically carved daily from incoming gig earnings over 10 days.`,
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// MOUNT FULL FEATURE ROUTES (AUTH, WORKERS, LENDERS, WALLET, OFFERS)
// ============================================================================
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/workers', require('./routes/workerRoutes'));
  app.use('/api/lenders', require('./routes/lenderRoutes'));
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));
  app.use('/api/gigscore', require('./routes/gigscoreRoutes'));
  app.use('/api/wallet', require('./routes/walletRoutes'));
  app.use('/api/offers', require('./routes/offerRoutes'));
  app.use('/api/loans', require('./routes/loanRoutes'));
} catch (err) {
  // Routes optional in fallback mode
}

// ============================================================================
// GLOBAL ERROR HANDLING & 404 CATCHER
// ============================================================================

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred on the server.',
  });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

const PORT = process.env.PORT || 5001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 GigCredit Infrastructure Backend running on port ${PORT}`);
    console.log(`   Health Check: GET http://localhost:${PORT}/`);
    console.log(`   Sync Endpoint: POST http://localhost:${PORT}/api/sync`);
    console.log(`   Score Endpoint: GET http://localhost:${PORT}/api/score`);
    console.log(`   Withdraw Endpoint: POST http://localhost:${PORT}/api/withdraw`);
    console.log(`====================================================`);
  });
}

module.exports = app;
