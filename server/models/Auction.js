const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  minIncrement: { type: Number, required: true, default: 1 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  highestBidderName: { type: String },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['active', 'ended', 'cancelled'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Auction', AuctionSchema);