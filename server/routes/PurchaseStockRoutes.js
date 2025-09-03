const express = require('express');
const router = express.Router();
const StockController = require('../controllers/PurchaseStockController');

// Define routes for appointments
router.post("/purchase", StockController.savePurchase);
router.get('/stock', StockController.ReadStock);


module.exports = router;
