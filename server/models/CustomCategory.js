const mongoose = require('mongoose');

const CustomCategorySchema = new mongoose.Schema({
    dealer_id: {
        type: String,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
    } 
});

module.exports = mongoose.model('CustomCategory', CustomCategorySchema);
