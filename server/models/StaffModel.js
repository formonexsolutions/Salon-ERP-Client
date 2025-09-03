const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  staff_id: { type: String, unique: true },
  adminName: { type: String },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  salon_id: { type: String },
  branch_id: { type: String },
  status: {
    type: String,
    enum: ['AA', 'IA'],
    default: 'AA',
  },
  otp: { type: String }, 
  loginOtp: { type: String }, // OTP for login authentication
});

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;

