const mongoose = require('mongoose');

const dealpurchaseProductSchema = new mongoose.Schema({
  purchaseOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  purchaseDate: String,
  // billNumber: String,
  branchId: { type: String, required: true }, // Change branch_id to branchId
  branchName: { type: String, required: true },
  dealerName: String,
  dealerPhone: Number,
  dealerId: String,
  state: String,
  city: String,
  area: String,
  dealerCompany: String,
  salonId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Ordered', 'Accepted', 'Delivered','Cancelled'],
    default: 'Ordered',
  },
  // paymentType: String,
  companyName: String,
  address: String,
  phoneNumber: {
    type: Number,
    required: true,
  },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  modifiedBy: String,
  modifiedAt: { type: Date, default: Date.now },
  deliveryDate: { type: Date, default: null },
  viewed: { type: Boolean, default: false },
  tableData: [{
    Productquantity: String,
      categoryName: String,
      company:String,
      productName:String,
      productDescription: String,
      quantity: String,
      unit: String,
    availableQuantity: {
      type: String,
   
      
    },
    availability: {
      type: String,
      enum: ['InStock', 'OutOfStock'],
      default: 'InStock'
    }
  }]
});

module.exports = mongoose.model('DealersPurchaseProduct', dealpurchaseProductSchema);
