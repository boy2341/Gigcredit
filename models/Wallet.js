const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    category: {
      type: String,
      enum: ['gig_payout', 'loan_disbursement', 'repayment', 'add_money', 'withdrawal', 'micro_emi_deduction', 'escrow_sweep', 'other'],
      default: 'other',
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    source: { type: String, default: 'GigCredit Escrow' }, // e.g. "Uber", "Swiggy Escrow", "Bank Transfer"
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const WalletSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true, unique: true },
    balance: { type: Number, default: 0 },
    escrowVirtualAccountId: { type: String, default: 'ESCROW-9042-8819' },
    transactions: [TransactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', WalletSchema);
