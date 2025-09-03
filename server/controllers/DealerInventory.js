const DealerInventory = require('../models/DealerInventory');

exports.addProduct = async (req, res) => {
  try {
    const product = new DealerInventory(req.body);
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error while adding product', error);
    res.status(500).json({ message: 'Error while adding product', error });
  }
};
exports.getProducts = async (req, res) => {
// const getProducts = 
  try {
    const dealerId = req.params.dealerId;
    const products = await DealerInventory.find({ dealer_id: dealerId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error while fetching products', error);
    res.status(500).json({ message: 'Error while fetching products', error });
  }
};

// module.exports = { addProduct, getProducts };

exports.updateProduct = async (req, res) => {
  try {
    const { dealerProductId } = req.params; // Match parameter name with frontend code
    const { categoryName, company, productName, productDescription, expiryDate, sellingprice, stock } = req.body;

    // Validate required fields
    if (!categoryName || !company || !productName || !productDescription || !expiryDate || !sellingprice || !stock) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find and update the product
    const updatedProduct = await DealerInventory.findOneAndUpdate(
      { dealerProductId: dealerProductId }, // Match by dealerProductId
      { categoryName, company, productName, productDescription, expiryDate, sellingprice, stock },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
