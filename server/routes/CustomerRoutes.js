const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
// const Middleware = require('../controllers/Middleware'); 

router.post('/customers',  CustomerController.CreateCustomer);
router.put('/customers/:id', CustomerController.UpdateCustomer);
router.get('/customers', CustomerController.GetCustomers);



// New route for daily statistics
router.get('/customers/daily-statistics', CustomerController.GetDailyStatistics);
router.get('/appointments', CustomerController.getAppointmentsByBranch);

module.exports = router;
