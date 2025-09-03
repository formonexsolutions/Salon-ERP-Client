

const Product = require("../models/DealersProductModel");
const Salon = require("../models/RegisterModel");

exports.DealCreateProduct = async (req, res) => {
  try {
    // Fetch the salonId from the request body
    const { salonId, ...productData } = req.body;

    // Check if the salonId exists in the database
    const salonExists = await Salon.exists({ salon_id: salonId });
    if (!salonExists) {
      return res.status(400).json({ error: "Salon not found." });
    }

    const newProduct = new Product({
      ...productData,
      salonId, // Save the received salonId in the product data
      createdAt: new Date(),
      modifiedAt: new Date(),
    });

    await newProduct.save();
    res.status(200).json({ message: "Product created successfully.", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error." }); // Send a generic error message
  }
};

exports.DealReadProduct = async (req, res) => {
  try {
    const salonId = req.headers.salon_id; // Assuming you pass salon_id in headers
    const products = await Product.find({ salonId }); // Filter products by matching salonId
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.DealUpdateProduct = async (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body;

  updatedData.modifiedBy = req.body.username;
  updatedData.modifiedAt = new Date();

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully." });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.ToggleProductStatus = async (req, res) => {
  const productId = req.params.id;
  const { status, username } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        status: status,
        statusBy: username,
        statusAt: new Date()
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product status updated successfully." });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.DeleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "No product with that id" });
    }
    res.status(200).json({ message: "Product has been removed" });
  } catch (err) {
    // console.log("Couldn't delete the product", err);
    res.status(500).send("Failed to delete product");
  }
};