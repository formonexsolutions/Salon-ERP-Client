const express = require('express');
const router = express.Router();
const dealerCategoryController = require('../controllers/DealerCategory');

// Create a new dealer category
router.post('/dealercategories', dealerCategoryController.createDealerCategory);

// Get all dealer categories for a specific dealer
router.get('/dealercategories', dealerCategoryController.getDealerCategory);
router.put('/dealercategories/:id', dealerCategoryController.updateDealerCategory);
router.put('/customcategory', dealerCategoryController.createCustomCategory);
router.get('/customcategory/:dealer_id', dealerCategoryController.fetchcategarydetail);
router.get('/dealercompanies/:dealer_id/:categoryName', dealerCategoryController.fetchCompaniesByCategory);
router.get('/dealerproducts/:dealerId/:categoryName/:company', dealerCategoryController.fetchProductsByCategoryAndCompany);
router.get('/productdescriptions/:dealerId/:categoryName/:company/:productName', dealerCategoryController.fetchProductDescriptions);
router.get('/quantity-unit/:dealerId/:categoryName/:company/:productName/:productDescription', dealerCategoryController.fetchProductDetails);
  
module.exports = router;