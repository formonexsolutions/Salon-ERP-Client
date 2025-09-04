const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/DealerController'); // Import your controller functions
const fileUpload = require('express-fileupload'); // Middleware for file uploads

router.use(fileUpload());

// Route for dealer registration
router.post('/dealers', dealerController.registerDealer);
router.post('/verifyotp', dealerController.verifyOtp);

// Route to get all registered dealers
router.get('/dealers', dealerController.getAllDealers);

// Route to get dealer by phone number
router.get('/dealers/:phoneNumber', dealerController.getDealerByPhoneNumber);
router.put('/dealerupdate/:id', dealerController.addStauts);
router.post('/verifyotp',dealerController.verifyOtp)
router.post('/dealers/login', dealerController.dealerLogin);
router.post('/dealers/send-login-otp', dealerController.sendDealerLoginOtp);
router.post('/dealers/verify-login-otp', dealerController.verifyDealerLoginOtp);
router.post('/dealers/forgot-password', dealerController.dealerForgotPassword);
router.post('/dealers/verify-otp', dealerController.dealerVerifyOtp);
router.post('/dealers/reset-password', dealerController.dealerResetPassword);
router.put('/dealers/:dealerId/activation', dealerController.updateActivationStatus);
router.get('/dealers/states', dealerController.getDistinctStates);
router.get('/cities-by-state', dealerController.getCitiesByState);
router.get('/areas-by-state-and-city', dealerController.getAreasByStateAndCity);
// router.get('/dealers-by-location', dealerController.getDealersByLocation);
router.get('/dealers-by-state-city-area', dealerController.getDealersByStateCityArea);
router.get('/dealer/:dealerId', dealerController.getDealerById);
router.post('/import', dealerController.importDealers);

module.exports = router;
