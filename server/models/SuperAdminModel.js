const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
  superAdminId: {
    type: String,
    required: true,
    unique: true,
  },
  superAdminName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    
  },
  confirmpassword: {
    type: String,
    
  },
  role: {
    type: String,
    enum: 'superAdmin', 
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedBy: {
    type: String,
    default: 'None',
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['AA', 'IA'],
    default: 'IA',
  },
  otp: { type: String }, 
  loginOtp: { type: String }, // OTP for login authentication
});

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;
