const mongoose = require('mongoose');

const LoanOfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. "Vehicle Repair Loan"
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: 'Lender', default: null }, // null = system/auto-generated (GigCredit Capital)
    source: { type: String, enum: ['system', 'lender'], default: 'system' },

    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true }, // annual %
    tenureMonths: { type: Number, required: true },

    status: {
      type: String,
      enum: ['available', 'accepted', 'rejected', 'expired'],
      default: 'available',
    },

    purpose: { type: String, default: 'General purpose' },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanOffer', LoanOfferSchema);
