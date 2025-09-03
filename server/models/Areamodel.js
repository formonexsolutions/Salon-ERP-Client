const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  areaId: { type: String, required: true },
  stateId: { type: String, required: true },
  cityId: { type: String, required: true },
  areaName: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  modifiedBy: { type: String },
  modifiedAt: { type: Date, default: Date.now },
  status: { type: String, required: true }
});

module.exports = mongoose.model('Area', areaSchema);
