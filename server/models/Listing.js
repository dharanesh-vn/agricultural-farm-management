const mongoose = require('mongoose');
const ListingSchema = new mongoose.Schema({
seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true },
description: { type: String, required: true },
price: { type: Number, required: true },
category: { type: String, enum: ['produce', 'equipment'], required: true },
isSold: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Listing', ListingSchema);