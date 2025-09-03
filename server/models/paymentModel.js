const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    default: '',  // Default value to empty string
  },
  paymentId: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: '',  // Default value to empty string
  },
  salon_id: {
    type: String, // Adjust the data type as per your actual requirement
    required: true,
  },
  phoneNumber: {
    type: String, // Adjust the data type as per your actual requirement
    required: true,
  },
  subscription_id: {
    type: String,
    unique: true,
    required: true,
  },
  subscription_startDate: {
    type: Date,
    default: '',
  },
  subscription_expiryDate: {
    type: Date,
    default: '',
  },
  status: {
    type: String,
    enum: ['Payment Done', 'Payment Failed', 'Pending'], // Include 'Pending' as a valid value
    default: 'Pending', // Default status to Pending
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', PaymentSchema);
