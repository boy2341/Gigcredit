/**
 * ============================================================================
 * GigCredit - Infrastructure Layer & Underwriting Marketplace for Gig Workers
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const { generalApiLimiter } = require('./middleware/rateLimiters');

const app = express();

// ============================================================================
// CORS
// ============================================================================
// Since Express serves the frontend from the same origin (see express.static
// below), most real traffic never needs CORS at all. This allowlist exists
// for local development (a frontend running on a different port) and for
// any separately-hosted frontend deployments.
//
// Configure via env: ALLOWED_ORIGINS="https://gigcredit.example.com,https://staging.gigcredit.example.com"
// If ALLOWED_ORIGINS is unset, only localhost origins are allowed (safe local-dev default)
// rather than the previous cors() default of reflecting any origin.
const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const defaultDevOrigins = ['http://localhost:5001', 'http://127.0.0.1:5001', 'http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = configuredOrigins.length ? configuredOrigins : defaultDevOrigins;

const corsOptions = {
  origin(origin, callback) {
    // No origin header = same-origin request, curl, server-to-server, mobile app, etc. Always allow.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin '${origin}' is not allowed`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend and uploads static files for local demonstration
const fs = require('fs');
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, 'uploads', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const fileBuf = fs.readFileSync(filePath);
    const contentHead = fileBuf.toString('utf8', 0, 100);
    if (contentHead.includes('<svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(fileBuf);
    }
  }
  next();
}, express.static(path.join(__dirname, 'uploads')));

connectDB();

// ============================================================================
// HEALTH CHECK ENDPOINTS
// ============================================================================
app.get('/', (req, res) => {
  if (req.accepts('html') && !req.xhr) {
    return res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
  }
  res.status(200).json({ status: 'healthy' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================================================
// API ROUTES (auth, workers, lenders, wallet, offers, loans, dashboard)
// ============================================================================
// A generous general rate limit backstops every /api/* route; specific routes
// layer tighter limits on top for login/OTP/money-movement (see each router).
app.use('/api', generalApiLimiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workers', require('./routes/workerRoutes'));
app.use('/api/lenders', require('./routes/lenderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/gigscore', require('./routes/gigscoreRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/agents', require('./routes/agentPipelineRoutes'));

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
    console.log(`🚀 GigCredit Backend running on port ${PORT}`);
    console.log(`   Health Check: GET http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;
