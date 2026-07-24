const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PlatformSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ['Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Uber India', 'Ola', 'Porter', 'Rapido', 'Urban Company', 'Shadowfax'],
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
    upiId: { type: String, default: 'worker@okaxis' },
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    bio: { type: String, default: 'Dedicated gig professional with multi-platform earnings history across India.' },
    tagline: { type: String, default: 'Swiggy & Zomato Fleet Captain' },
    city: { type: String, default: 'Bengaluru' },
    vehicleType: { type: String, default: 'EV Scooter' },
    preferredLanguage: { type: String, default: 'Hindi' },

    // Indian KYC & Personal details
    kycStatus: {
      panNumber: { type: String, default: 'ABCDE1234F' },
      aadhaarLast4: { type: String, default: '9924' },
      verified: { type: Boolean, default: true },
    },
    dateOfBirth: { type: Date },
    address: { type: String, trim: true },

    // Step 2: Account Aggregator & Escrow setup
    accountAggregatorConsent: {
      granted: { type: Boolean, default: true },
      provider: { type: String, default: 'Finvu AA Rails (RBI Approved)' },
      consentId: { type: String, default: 'AA-FINVU-9924' },
      aaHandle: { type: String, default: 'worker@finvu' },
    },
    escrowVirtualAccount: {
      accountId: { type: String, default: 'ESCROW-9042-8819' },
      ifscCode: { type: String, default: 'HDFC0000240' },
      bankName: { type: String, default: 'HDFC Bank Escrow Services' },
      status: { type: String, default: 'Active Escrow Provisioned' },
    },

    // Simulated primary bank connection
    bankConnected: { type: Boolean, default: true },
    bankName: { type: String, default: 'HDFC Bank' },
    bankAccountMasked: { type: String, default: '****4821' },

    // Step 3: Underwriting & Multi-App Metrics
    underwritingMetrics: {
      multiAppIncomeVelocity: { type: Number, default: 14.8 }, // % growth month over month
      incomeStabilityIndex: { type: Number, default: 92 }, // 0-100 score
      operationalTrustScore: { type: Number, default: 96 }, // 0-100 score
      loginConsistencyDays: { type: Number, default: 27 }, // days logged in per month
      avgDailyHours: { type: Number, default: 8.5 },
    },

    // Step 8: Closed-loop Micro EMI rate (in INR ₹)
    microEMIDeductionRate: { type: Number, default: 100 }, // ₹100 daily source deduction

    // Full Underwriting Analysis Report Object
    fullUnderwritingReport: {
      generatedAt: { type: Date, default: Date.now },
      gigCreditScore: { type: Number, default: 742 },
      riskTier: { type: String, default: 'Prime (Low Risk)' },
      verifiedMonthlyIncome: { type: Number, default: 44500 },
      approvedCreditLine: { type: Number, default: 120000 },
      dailyAutoEMI: { type: Number, default: 100 },
      aaConsentId: { type: String, default: 'AA-FINVU-9924' },
      smsIngestedAlertsCount: { type: Number, default: 14 },
      fipBanks: [{ type: String }],
    },

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
    riskTier: { type: String, enum: ['Prime (Low Risk)', 'Standard (Medium Risk)', 'Starter (Higher Risk)'], default: 'Standard (Medium Risk)' },

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
