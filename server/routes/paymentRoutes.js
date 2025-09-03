const express = require('express');
const {
  getRazorpayKey,
  checkout,
  paymentVerification,
  getSubscriptionsBySalonId,
  createInitialPaymentRecord,
  updatePaymentRecord,
  getPaymentStatus
} = require('../controllers/paymentController');

const router = express.Router();

router.get('/getkey', getRazorpayKey);
router.post('/checkout', checkout); // This should point to the correct checkout handler
router.post('/paymentverification', paymentVerification);
router.post('/create-order', checkout); // Ensure this route exists with correct handler
router.get('/subscriptions', getSubscriptionsBySalonId);
router.post('/create-initial-payment', createInitialPaymentRecord); // Add the new route
router.put('/updatePaymentRecord', updatePaymentRecord);
router.get("/status", getPaymentStatus);  // New route to get payment status


module.exports = router;
