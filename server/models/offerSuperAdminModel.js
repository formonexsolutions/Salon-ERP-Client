const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  interested: {
    type: String,
    enum: ["yes", "no"],
    default: "no",
    
  },
  interestedUsers: [
    {
      productName: {
        type: String,
        required: true,
      },
      name: String,
      phoneNumber: String,
      interestedDate: { type: Date, default: Date.now }
    },
  ],
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
