const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  stripeSessionId: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Payment', PaymentSchema);