const rateLimit = require('express-rate-limit');

// Shared JSON response shape so rate-limit errors look like every other API error.
const jsonHandler = (req, res /* , next, options */) => {
  res.status(429).json({
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests. Please wait a bit before trying again.',
  });
};

// Login/register: prevents credential-stuffing and brute-force password guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});

// OTP endpoints: OTP-guessing is cheap (6 digits) unless the endpoint itself is throttled.
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});

// Money-movement endpoints (withdraw/add-money/payout simulation): throttle regardless
// of auth, since a compromised token or a bug elsewhere shouldn't allow rapid-fire drains.
const moneyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});

// General fallback for all other /api/* traffic — generous, just a backstop against abuse/scraping.
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});

module.exports = { authLimiter, otpLimiter, moneyLimiter, generalApiLimiter };
