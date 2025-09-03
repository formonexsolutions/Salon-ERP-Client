
const mongoose = require('mongoose');


const branchSchema = new mongoose.Schema({
  branch_id: {
    type: String,
    required: true,
  },
  salon_id: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'IA',
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedBy: String,
  modifiedAt: { type: Date, default: Date.now },
  statusBy: String,
  statusAt: { type: Date, default: Date.now },
});

let Branch;
if (mongoose.modelNames().includes('Branch')) {
  Branch = mongoose.model('Branch');
} else {
  Branch = mongoose.model('Branch', branchSchema);
}

module.exports = Branch;
