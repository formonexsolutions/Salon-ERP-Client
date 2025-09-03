// module.exports = router;
const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/SuperAdminController");
const SuperAdmin = require("../models/SuperAdminModel");

router.post("/", superAdminController.createSuperAdmin); // Changed route to root
router.get("/fetch", superAdminController.fetchSuperAdmins);

// Route to update phone number
router.put("/update-phone", superAdminController.updatePhoneNumber);

// Route to update password
router.put("/update-password", superAdminController.updatePassword);

router.put('/:id/status',superAdminController.updateStatus);

module.exports = router;
