const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.post('/Products', ProductController.CreateProduct);
router.put('/Products/:id', ProductController.UpdateProduct);
router.put('/Products/:id/status', ProductController.ToggleProductStatus); // Route for toggling status
router.get('/Products', ProductController.ReadProduct);
router.delete('/Products/:id', ProductController.DeleteProduct);

module.exports = router;
