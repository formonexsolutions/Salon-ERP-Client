const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    PlanId: { type: String, required: true, unique: true },
    PlanName: { type: String, required: true, minlength: 10, maxlength: 50 },
    Duration: {
        type: Number,
        required: true,
        minlength: 6,
        maxlength: 10,
        validate: {
          validator: function(v) {
            return /^([5-9]|[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-5]) ?$/.test(v);
          },
          message: props => `${props.value} is not a valid duration. It should be between 5 days and 365 days.`,
        }
      },
    Amount: { type: Number, required: true, min: 1, maxlength: 999999 }, // Min 5 digits
    Feature1: { type: String, minlength: 10, maxlength: 100 },
    Feature2: { type: String, minlength: 10, maxlength: 100 },
    CreatedBy: { type: String },
    CreatedAt: { type: Date, default: Date.now },
    ModifiedBy: { type: String },
    ModifiedAt: { type: Date },
    Status: { type: String, enum: ["AA", "IA"], required: true } // Updated Status field
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
