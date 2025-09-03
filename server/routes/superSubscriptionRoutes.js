// routes/superSubscriptionRoutes.js
const express = require("express");
const router = express.Router();
const superSubscriptionController = require("../controllers/superSubscriptionController");

router.get("/generatePlanId", superSubscriptionController.generatePlanId);

router.post("/plans", superSubscriptionController.addPlan);

// Route to fetch all plans
router.get("/plans", superSubscriptionController.getAllPlans);

router.put('/plans/:id/update-status', superSubscriptionController.updatePlanStatus);

router.put('/plans/:id/update-plan', superSubscriptionController.updatePlan);


router.get("/active-plans", superSubscriptionController.getActivePlans);

module.exports = router;
