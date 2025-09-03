const express = require('express');
const router = express.Router();
const dealerInventoryController = require('../controllers/DealerInventory');

// Add a new product
router.post('/dealerinventory', dealerInventoryController.addProduct);

// Get all products
router.get('/dealerinventory/:dealerId', dealerInventoryController.getProducts);

// Update a specific product
router.put('/dealerinventory/:dealerProductId', dealerInventoryController.updateProduct);


module.exports = router;
