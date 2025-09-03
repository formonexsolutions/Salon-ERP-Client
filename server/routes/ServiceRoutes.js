const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/ServiceController");

// Define routes for services
router.post("/services", ServiceController.CreateService);
router.put("/services/:id", ServiceController.UpdateService);
router.get("/services", ServiceController.ReadService);
router.put("/services/:id/status", ServiceController.UpdateServiceStatus); // New route for updating status
router.delete("/services/:id", ServiceController.DeleteService);

module.exports = router;
