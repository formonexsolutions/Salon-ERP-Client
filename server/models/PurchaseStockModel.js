const mongoose = require('mongoose');

const purchaseProductSchema = new mongoose.Schema({
  purchaseDate: String,
  billNumber: String,
  branchId: { type: String, required: true }, // Change branch_id to branchId
  branchName: { type: String, required: true },
  salonId: {
    type: String,
    required: true,
  },
  paymentType: String,
  companyName: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  modifiedBy: String,
  modifiedAt: { type: Date, default: Date.now },
  tableData: [{
    product: String,  // Store the product name instead of the ID
    quantity: String,
    cp: String,
    
  }]
});

module.exports = mongoose.model('PurchaseProduct', purchaseProductSchema);
