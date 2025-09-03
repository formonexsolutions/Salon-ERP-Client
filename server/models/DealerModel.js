const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    DealerName: { type: String, required: true },
    CompanyName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    dealer_id: { type: String },
    area: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
//  otpVerified: { type: Boolean, default: false },
    otp: { type: String }, 
    approvedstatus: {
        type: String,
        enum: ['pending', 'approve', 'hold', 'decline'],
        default: 'pending'
      },
      status: {
        type: String,
        enum: ['AA', 'IA'],
        default: 'IA'
    },
    
});

const Dealer = mongoose.model('Dealer', dealerSchema);

module.exports = Dealer;
