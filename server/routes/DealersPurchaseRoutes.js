const express = require('express');
const router = express.Router();
const DealStockController = require('../controllers/DealersPurchaseController');

// Define routes for appointments
router.post("/dealerspurchase", DealStockController.dealsavePurchase);
router.get('/dealstock', DealStockController.dealReadStock);
router.get('/purchase-details', DealStockController.getPurchaseDetails);
router.get('/purchase-details-fetch', DealStockController.fetchPurchaseDetails);


router.get('/dealers/branch-details', DealStockController.getBranchDetails);
router.get('/dealers/branch-products/:branchName', DealStockController.getProductsByBranch);
router.put('/dealers/update-delivery-date', DealStockController.updateDeliveryDate);
router.put('/dealers/update-order-status', DealStockController.updateOrderStatus);
router.put('/dealers/update-product-availability', DealStockController.updateProductAvailability);

router.put("/dealers/update-available-quantity", DealStockController.updateAvailableQuantitys);
router.get('/order-statistics', DealStockController.getOrderStatistics);
router.post('/mark-orders-as-viewed', DealStockController.markOrdersAsViewed);

module.exports = router;
