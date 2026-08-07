const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const LenderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    institutionName: { type: String, trim: true, default: 'Independent Lender' },
    phone: { type: String, trim: true },
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' },
    logoUrl: { type: String, default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80' },
    nbfcLicenseNo: { type: String, default: 'FIN-INST-03290' },
    rbiRegistrationNo: { type: String, default: 'REG-INST-884210' },
    headquarters: { type: String, default: 'Mumbai, Maharashtra' },
    partnerBank: { type: String, default: 'HDFC Bank Escrow Trustees' },
    collectionRate: { type: Number, default: 99.6 }, // % default prevention rate via Escrow Escrow Trust

    // Cached portfolio stats (recomputed whenever loans/offers change)
    activePortfolioValue: { type: Number, default: 0 },
    totalMoneyLent: { type: Number, default: 0 },

    // True only for accounts created by the seed script for demo purposes.
    // Used to gate the password-less "switch demo account" login endpoint so
    // it can never be used to hijack a real user's account.
    isDemoAccount: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LenderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

LenderSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

LenderSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Lender', LenderSchema);
