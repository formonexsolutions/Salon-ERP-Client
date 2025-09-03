const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerId: String,
  name: String,
  dob: String,
  email: String,
  address: String,
  phone: String,
  branchId: {
    type: String,
  },
  branchName: {
    type: String,
  },
  salon_id: {
    type: String, // Added salon_id field
  },
  createdBy: {
    type: String,
  },
  modifiedBy: { type: String },
  modifiedAt: { type: Date },
  appointments: [
    {
      appointmentId: String, // Added appointmentId field
      branchId: {
        type: String,
      },
      name: String,
      address: String,
      phone: String,
      discount: String,
      date: String,
      fromTiming: String,
      toTiming: String,
      notes: String,
      selectedServices: [String],
      stylist: String,
      createdBy: { type: String },
      createdAt: { type: Date, default: Date.now },
      modifiedBy: { type: String },
      modifiedAt: { type: Date },
    },
  ],
  billing: [
    {
      billNumber: {
        type: String,
        required: true,
      },

      date: String,
      customer: String,
      name: String,
      services: [
        {
          id: String,
          serviceName: String,
          price: Number,
          employee: String,
        },
      ],
      items: [
        {
          itemName: String,
          price: Number,
          quantity: Number,
        },
      ],
      serviceDiscountPercent: Number,
      itemDiscountPercent: Number,
      serviceGstPercent: Number,
      // itemGstPercent: Number,
      serviceFinalTotal: Number,
      itemFinalTotal: Number,
      gstNumber: String,
      paymentMethod: String,
      totalAmount: Number,
      branchId: {
        type: String,
        required: true,
      },
      branchName: {
        type: String,
        required: true,
      },
      createdByName: {
        type: String, // Changed to createdByName to avoid potential conflicts
      },
      modifiedBy: { type: String },
      modifiedAt: { type: Date },
    },
  ],
});

customerSchema.pre("save", async function (next) {
  try {
    if (!this.customerId) {
      const maxCustomerId = await mongoose
        .model("Customer")
        .findOne({}, { customerId: 1 })
        .sort({ customerId: -1 })
        .exec();

      const lastNumber = maxCustomerId
        ? parseInt(maxCustomerId.customerId?.substring(3)) || 0
        : 0;
      const newNumber = lastNumber + 1;
      this.customerId = `CUS${String(newNumber).padStart(4, "0")}`;
    }

    // Generate appointmentId for each appointment
    this.appointments.forEach((appointment) => {
      if (!appointment.appointmentId) {
        const maxAppointmentId = this.appointments.reduce((maxId, current) => {
          const currentId = parseInt(current.appointmentId?.substring(3)) || 0;
          return currentId > maxId ? currentId : maxId;
        }, 0);
        const newAppointmentId = maxAppointmentId + 1;
        appointment.appointmentId = `APMT${String(newAppointmentId).padStart(4, "0")}`;
      }
    });

    next();
  } catch (error) {
    next(error);
  }
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
