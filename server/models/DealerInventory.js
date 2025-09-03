const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DealerInventorySchema = new Schema(
  {
    dealerProductId: {
      type: String,
      unique: true,
    },
    // itemName: {
    //   type: String,
    //   required: true,
    // },

    expiryDate: {
      type: Date,
      required: true,
    },
    sellingprice: {
      type: Number,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
  },
  company: {
      type: String,
      required: true,
  },
  productName: {
      type: String,
      required: true,
  },
  productDescription: {
    type: String,
    required: true,
},
  quantity: {          // Added quantity field
    type: Number,
    required: true,
},
unit: {              // Added unit field
    type: String,
    required: true,
    enum: ['ml', 'kg', 'gram'],  // Restricting to specific units
},
    stock: {
      type: Number,
      required: true,
    },
    dealer_id: {
      type: String,
      required: true,
    },
  },
  
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

DealerInventorySchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const count = await mongoose.model("DealerInventory").countDocuments();
    this.dealerProductId = `PRD${(count + 1).toString().padStart(3, "0")}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('DealerInventory', DealerInventorySchema);
