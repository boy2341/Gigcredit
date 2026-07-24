const mongoose = require('mongoose');

const RepaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['paid', 'scheduled', 'late'], default: 'paid' },
  },
  { _id: true }
);

const LoanSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: 'Lender', default: null }, // null = GigCredit Capital (system)
    offer: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanOffer', required: true },

    title: { type: String, required: true },
    principal: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    monthlyEMI: { type: Number, required: true },

    outstandingBalance: { type: Number, required: true },
    amountRepaid: { type: Number, default: 0 },

    status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' },
    disbursedAt: { type: Date, default: Date.now },
    nextDueDate: { type: Date },

    repayments: [RepaymentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loan', LoanSchema);
