const DealerCategory = require('../models/DealerCategory');
const CustomCategory = require("../models/CustomCategory")

// Create a new dealer category
exports.createDealerCategory = async (req, res) => {
    try {
        const { dealer_id, categoryName, company, productName, productDescription, quantity, unit } = req.body;

        // Check if all required fields are provided
        if (!dealer_id || !categoryName || !company || !productName || !productDescription || !quantity || !unit) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newCategory = new DealerCategory({
            dealer_id,
            categoryName,
            company,
            productName,
            productDescription,
            quantity,     // Added quantity field
            unit          // Added unit field
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


// Get all dealer categories
exports.getDealerCategory = async (req, res) => {
    try {
        const products = await DealerCategory.find();
        res.json(products);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
exports.updateDealerCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedCategory = await DealerCategory.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating dealer category', error });
    }
};

exports.createCustomCategory = async (req, res) => {
    try {
        const { dealer_id, categoryName } = req.body;

        // Check if all required fields are provided
        if (!dealer_id || !categoryName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newCategory = new CustomCategory({
            dealer_id,
            categoryName
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.fetchcategarydetail = async (req, res) => {
    try {
        const { dealer_id } = req.params;

        // Use MongoDB aggregation to get unique category names
        const categories = await CustomCategory.aggregate([
            { $match: { dealer_id } }, // Filter by dealer_id
            { $group: { _id: "$categoryName", category: { $first: "$$ROOT" } } }, // Group by categoryName and keep the first occurrence
            { $replaceRoot: { newRoot: "$category" } } // Replace root to get original document structure
        ]);

        // Check if categories exist
        if (!categories.length) {
            return res.status(404).json({ message: 'No categories found for this dealer' });
        }

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch companies based on category name
exports.fetchCompaniesByCategory = async (req, res) => {
    try {
        const { dealer_id, categoryName } = req.params;

        // Fetch companies associated with the given category name and dealer_id
        const companies = await DealerCategory.find({ dealer_id, categoryName }).select('company');

        // Check if companies exist
        if (!companies.length) {
            return res.status(404).json({ message: 'No companies found for this category' });
        }

        res.status(200).json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.fetchProductsByCategoryAndCompany = async (req, res) => {
    try {
      const { dealerId, categoryName, company } = req.params;
  
      // Fetch products based on dealerId, categoryName, and company
      const products = await DealerCategory.find({
        dealer_id: dealerId,
        categoryName: categoryName,
        company: company
      });
  
      if (!products.length) {
        return res.status(404).json({ message: 'No products found' });
      }
  
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.fetchProductDescriptions = async (req, res) => {
    const { dealerId, categoryName, company, productName } = req.params;

    try {
        const products = await DealerCategory.find({ 
            dealer_id: dealerId, 
            categoryName: categoryName, 
            company: company, 
            productName: productName 
        });

        if (!products.length) {
            return res.status(404).json({ message: 'Product descriptions not found' });
        }

        // Extract descriptions
        const descriptions = products.map(product => product.productDescription);
        
        res.json(descriptions);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
// Controller function
exports.fetchProductDetails = async (req, res) => {
    const { dealerId, categoryName, company, productName, productDescription } = req.params;
    // console.log('Parameters received:', { dealerId, categoryName, company, productName, productDescription });

    try {
        // Fetch inventory items matching the provided criteria
        const products = await DealerCategory.find({
            dealer_id: dealerId, 
            categoryName: categoryName, 
            company: company, 
            productName: productName, 
            productDescription: productDescription
        }).select('quantity unit');

        if (!products.length) {
            return res.status(404).json({ message: 'Product descriptions not found' });
        }

        // Map the results to get quantity and unit arrays
        const quantities = products.map(product => product.quantity);
        const units = products.map(product => product.unit);

        res.json({ quantities, units });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

