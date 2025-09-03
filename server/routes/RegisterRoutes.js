
const express = require('express');
const router = express.Router();
const salonController = require('../controllers/RegisterController'); // Import your controller functions
const { sendOTP } = require('../controllers/RegisterController');


// Route for salon registration
router.post('/register', salonController.registerSalon);
router.post('/EchangePassword', salonController.changePassword);
router.post('/updateUsername',salonController.updateUsername);

// Route to get all registered salons
router.get('/salons', salonController.getAllSalons);

router.get('/staff', salonController.getAllStaff);

router.put('/superupdate/:id', salonController.addStauts);
router.get('/superfetch', salonController.fetchstatus);
router.get('/approved', salonController.fetchApprovedSalon);
router.put('/:salonId/activation', salonController.updateActivationStatus);
router.get('/states', salonController.getStates);
router.get('/cities', salonController.getAllCities);
router.get("/areas", salonController.getAreasByCity);

// route for sending OTP
// router.post('/send-otp', sendOTP);
// router.post('/verify-otp', salonController.verifyOTP);
router.get('/staffs', salonController.getStaffByPhoneNumber);
router.get('/:salonId/gst', salonController.fetchGSTBySalonId);

module.exports = router;
