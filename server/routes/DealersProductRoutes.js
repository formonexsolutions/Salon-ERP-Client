const express = require('express');
const router = express.Router();
const DealProductController = require('../controllers/DealersProductController');

router.post('/dealersproducts', DealProductController.DealCreateProduct);
router.put('/dealersproducts/:id', DealProductController.DealUpdateProduct);
router.put('/dealersproducts/:id/status', DealProductController.ToggleProductStatus); // Route for toggling status
router.get('/dealersproducts', DealProductController.DealReadProduct);
router.delete('/dealersproducts/:id', DealProductController.DeleteProduct);

module.exports = router;
