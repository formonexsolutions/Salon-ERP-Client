const mongoose = require('mongoose');

const DealerCategorySchema = new mongoose.Schema({
    dealer_id: {
        type: String,
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
    }
});

module.exports = mongoose.model('DealerCategory', DealerCategorySchema);
