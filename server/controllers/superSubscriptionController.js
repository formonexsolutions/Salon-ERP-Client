const Plan = require("../models/superSubscriptionModel");

exports.generatePlanId = async (req, res) => {
  try {
    const latestPlan = await Plan.findOne({}, {}, { sort: { PlanId: -1 } });
    let newPlanId = "PlanId001";
    if (latestPlan) {
      const lastPlanId = latestPlan.PlanId;
      const lastIdNumber = parseInt(lastPlanId.substring(7));
      newPlanId = "PlanId" + ("000" + (lastIdNumber + 1)).slice(-3);
    }
    res.status(200).json({ PlanId: newPlanId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate PlanId" });
  }
};

exports.addPlan = async (req, res) => {
  try {
    // Create new plan
    const newPlan = await Plan.create(req.body);
    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add plan' });
  }
};


exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};
exports.getActivePlans = async (req, res) => {
  try {
    const activePlans = await Plan.find({ Status: 'AA' });
    res.status(200).json(activePlans);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch active plans' });
  }
};



exports.updatePlanStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { Status: status },
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to update plan status" });
  }
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    // Basic validation
    if (!id || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to update plan" });
  }
};
