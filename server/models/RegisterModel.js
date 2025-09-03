
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const salonSchema = new mongoose.Schema({
  salon_id: {
    type: String,
    required: true,
    
  },
  SalonName: { type: String, required: true },
  adminName: { type: String, required: true },
  gst: { type: String,},
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: moment().tz('Asia/Kolkata').format() },
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

const Salon = mongoose.model('Salon', salonSchema);
salonSchema.post('save', async function (doc) {
  // If the salon is newly created or updated
  if (this.isNew || this.isModified('status')) {
    // Check if the status has changed to 'IA'
    if (doc.status === 'IA') {
      // Update the status in the RegisterModel to 'IA'
      await Salon.findByIdAndUpdate(doc._id, { status: 'IA' });
    }
  }
});
module.exports = Salon;