const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PlatformSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ['Swiggy', 'Uber', 'Blinkit', 'Rapido', 'Zepto', 'Amazon Flex', 'Porter'],
    },
    connectedAt: { type: Date, default: Date.now },
    monthlyEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    completedJobs: { type: Number, default: 0 },
    cancellationRate: { type: Number, default: 0 }, // percentage 0-100
  },
  { _id: false }
);

const WorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: true },
    phone: { type: String, trim: true },

    // Personal details
    dateOfBirth: { type: Date },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    aadhaarLast4: { type: String, trim: true },

    // Simulated bank connection
    bankConnected: { type: Boolean, default: false },
    bankName: { type: String, default: null },
    bankAccountMasked: { type: String, default: null },

    // Gig platform integrations
    connectedPlatforms: [PlatformSchema],

    // Score
    gigCreditScore: { type: Number, default: 300, min: 300, max: 900 },
    scoreBreakdown: {
      earningsScore: { type: Number, default: 0 },
      ratingScore: { type: Number, default: 0 },
      tenureScore: { type: Number, default: 0 },
      reliabilityScore: { type: Number, default: 0 },
    },
    accountAgeMonths: { type: Number, default: 1 },
    riskTier: { type: String, enum: ['Low Risk', 'Medium Risk', 'High Risk'], default: 'Medium Risk' },

    lastScoreUpdate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WorkerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

WorkerSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

WorkerSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Worker', WorkerSchema);
