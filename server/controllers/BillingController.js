
const mongoose = require('mongoose');
const Customer = require("../models/CustomerModel");
const Product = require("../models/ProductModel");

exports.CreateBill = async (req, res) => {
  const customerId = req.params.id;
  const billingData = req.body;

  try {
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Initialize billing array if it doesn't exist
    if (!customer.billing) {
      customer.billing = [];
    }

    // Generate bill number: Find the max bill number and increment
    let maxBillNumber = 0;
    if (customer.billing.length > 0) {
      maxBillNumber = Math.max(...customer.billing.map(bill => bill.billNumber));
    }
    const newBillNumber = maxBillNumber + 1;

    const newBillingData = {
      ...billingData,
      branchId: customer.branchId, // Add branchId
      branchName: customer.branchName, // Add branchName
      billNumber: newBillNumber,
      createdBy: new mongoose.Types.ObjectId(),
      createdByModel: billingData.createdByModel || "Register",
    };

    customer.billing.push(newBillingData);
    await customer.save();

    res.status(201).json("Billing data saved successfully for the customer");
  } catch (error) {
    console.error("Error saving billing data:", error.message);
    res.status(500).json({ error: "Error saving billing data." });
  }
};

exports.GetBill = async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    const billingData = customer.billing;
    if (!billingData || billingData.length === 0) {
      return res.status(404).json({ error: "Billing data not found for this customer." });
    }

    res.status(200).json(billingData);
  } catch (error) {
    console.error("Error fetching billing data:", error.message);
    res.status(500).json({ error: "Error fetching billing data." });
  }
};


exports.GetMaxBillNumber = async (req, res) => {
  const { branchId, branchName } = req.query;

  try {
    // Query for customers with billing data matching branchId and branchName
    const customers = await Customer.find({ branchId, branchName });

    // Initialize maxBillNumber to track the maximum value
    let maxBillNumber = 0;

    // Loop through each customer's billing data to find the maximum bill number
    customers.forEach((customer) => {
      if (customer.billing && customer.billing.length > 0) {
        customer.billing.forEach((bill) => {
          const billNumber = parseInt(bill.billNumber, 10);
          if (!isNaN(billNumber) && billNumber > maxBillNumber) {
            maxBillNumber = billNumber;
          }
        });
      }
    });

    // Respond with the maximum bill number found
    res.status(200).json({ maxBillNumber });
  } catch (error) {
    console.error("Error fetching max bill number:", error.message);
    res.status(500).json({ error: "Error fetching max bill number." });
  }
};



