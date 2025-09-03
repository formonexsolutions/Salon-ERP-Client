
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    sellingprice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    salonId: {
      type: String,
     
    },
    status: {
      type: String,
      enum: ["AA", "IA"],
      default: "AA",
    },
    createdBy: String,
    createdAt: Date,
    modifiedBy: String,
    modifiedAt: Date,
    statusBy: String,
    statusAt: Date,
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

productSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const count = await mongoose.model("Product").countDocuments();
    this.productId = `PRD${(count + 1).toString().padStart(3, "0")}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Product", productSchema);
