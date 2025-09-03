const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../controllers/ForgetPasswordController');

router.post('/sendOTP', forgetPasswordController.sendOTP);
router.post('/verifyOTP', forgetPasswordController.verifyOTP);
router.post('/resetPassword', forgetPasswordController.resetPassword);

module.exports = router;
