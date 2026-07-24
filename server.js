require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const lenderRoutes = require('./routes/lenderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const gigscoreRoutes = require('./routes/gigscoreRoutes');
const walletRoutes = require('./routes/walletRoutes');
const offerRoutes = require('./routes/offerRoutes');
const loanRoutes = require('./routes/loanRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

connectDB();

// --- Core middleware -------------------------------------------------
const allowedOrigins = (process.env.CLIENT_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));
app.use(express.static(path.join(__dirname, 'frontend')));

// --- Health check ------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'GigCredit API is running' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'homepage.html'));
});

// --- Routes --------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/lenders', lenderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gigscore', gigscoreRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/transactions', transactionRoutes);

// --- Error handling (must be last) --------------------------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] GigCredit API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
