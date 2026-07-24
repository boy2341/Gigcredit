const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');
const Lender = require('../models/Lender');

// Verifies the JWT sent in the Authorization header and attaches the
// authenticated user (worker or lender) plus their role to req.user
const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const Model = decoded.role === 'lender' ? Lender : Worker;
    const user = await Model.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists' });
    }

    req.user = user;
    req.userId = user._id;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

// Restricts a route to one or more roles, e.g. authorize('lender')
const authorize = (...roles) => (req, res, next) => {
  if (!req.role || !roles.includes(req.role)) {
    return res.status(403).json({
      success: false,
      message: `Role '${req.role}' is not permitted to access this resource`,
    });
  }
  next();
};

module.exports = { protect, authorize };
