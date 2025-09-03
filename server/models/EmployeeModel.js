
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
    unique: true,
  },
  branch_id: {
    type: String,
    required: true,
  },
  salon_id: {
    type: String,
    required: true,
  },
  employeeName: String,
  Qualification: String,
  password: String,
  phoneNumber: String,
  experience: String,
  specialization: String,
  gender: String,
  branchName: String,
  role: String,
  createdByName: String,
  createdAt: { type: Date, default: Date.now },
  modifiedBy: String,
  modifiedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['AA', 'IA'],
    default: 'IA'
  },
  statusBy: String,
  statusAt: {
    type: Date,
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  }
});

const Staff = mongoose.model('staff', staffSchema);

module.exports = Staff;
