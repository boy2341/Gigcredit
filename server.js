/**
 * ============================================================================
 * GigCredit - Infrastructure Layer & Underwriting Marketplace for Gig Workers
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const { generalApiLimiter } = require('./middleware/rateLimiters');

const app = express();

// ============================================================================
// PERMISSIVE CORS MIDDLEWARE (Supports Vercel, Localhost & Custom Domains)
// ============================================================================
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve uploads static files with SVG MIME type header middleware
app.use('/uploads', (req, res, next) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const fileBuf = fs.readFileSync(filePath);
      const contentHead = fileBuf.toString('utf8', 0, 100);
      if (contentHead.includes('<svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(fileBuf);
      }
    }
  } catch (e) {
    // Ignore static read errors
  }
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Connect database safely without process.exit(1)
connectDB();

// ============================================================================
// HEALTH CHECK & STATIC PAGE ROUTING
// ============================================================================
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================================================
// API ROUTES (auth, workers, lenders, wallet, offers, loans, dashboard, agents)
// ============================================================================
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

// Serve HTML pages for root and named routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/worker.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'worker.html'));
});

app.get('/lender.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'lender.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

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

// Server Initialization for Local Dev
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
