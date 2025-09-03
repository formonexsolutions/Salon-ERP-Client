const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  cityId: { type: String, required: true },
  stateId: { type: String, required: true },
  cityName: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  modifiedBy: { type: String },
  modifiedAt: { type: Date, default: Date.now },
  status: { type: String, required: true }
});

module.exports = mongoose.model('City', citySchema);
