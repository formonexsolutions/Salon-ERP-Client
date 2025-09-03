const express = require("express");
const router = express.Router();
const salonController = require("../controllers/salonController");

// POST /api/branches - Add a new branch
router.post("/", salonController.addBranch);
router.get("/", salonController.fetchBranches);

router.put("/:id", salonController.editBranch);
// GET /api/branches - Fetch branches
router.get("/", salonController.fetchBranches);
// PUT /api/branches/:id - Update branch details
router.put("/:id", salonController.editBranch);
// PUT /api/branches/:id/status - Update branch status
router.put("/:id/status", salonController.updatedStatus);

module.exports = router;
