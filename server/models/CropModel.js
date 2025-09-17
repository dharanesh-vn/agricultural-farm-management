const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    fieldName: { type: String, required: true },
    sowingDate: { type: Date, required: true },
    estimatedHarvestDate: { type: Date },
    status: { type: String, default: 'Planning' },
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);