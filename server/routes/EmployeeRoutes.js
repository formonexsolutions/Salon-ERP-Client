const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');


// Define routes for appointments
router.post('/employees', EmployeeController.CreateEmployee);
router.put('/employees/:id', EmployeeController.UpdateEmployee);
router.get('/employees', EmployeeController.ReadEmployee);
router.put('/employees/:id/status',EmployeeController.updateStatus);
router.get('/employees/stylists/bySalonAndBranch', EmployeeController.ReadStylistsBySalonAndBranch); // New route

// New route to fetch only stylists
router.get('/employees/stylists', EmployeeController.GetStylists);

module.exports = router;

