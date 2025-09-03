const mongoose = require('mongoose');

const selfUseStockSchema = new mongoose.Schema({
  items: [
    {
      product: String,
      quantity: String,
      consumedBy: String,
      branchId: String,
      branchName: String,   
      dateOfRequest: {
        type: Date,
      },
    },
  ],
  salonId: {
    type: String,
  },
});

module.exports = mongoose.model('SelfUseStock', selfUseStockSchema);
