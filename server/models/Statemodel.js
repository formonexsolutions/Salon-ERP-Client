const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
  stateId: {
    type: String,
    required: true,
  },
  stateName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedBy: {
    type: String,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('State', stateSchema);
