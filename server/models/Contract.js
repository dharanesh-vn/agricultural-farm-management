const mongoose = require('mongoose');
const ContractSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produce: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'awaiting_shipment', 'shipped', 'completed', 'disputed', 'cancelled'], default: 'pending' },
}, { timestamps: true });
module.exports = mongoose.model('Contract', ContractSchema);