const express = require("express");
const router = express.Router();
const BillingController = require("../controllers/BillingController");

router.post("/customers/:id/billing", BillingController.CreateBill);

router.get("/customers/:id/billing", BillingController.GetBill);

router.get("/billing/max-bill-number", BillingController.GetMaxBillNumber);

module.exports = router;
