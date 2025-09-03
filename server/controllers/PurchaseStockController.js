const PurchaseProduct = require('../models/PurchaseStockModel');
const Salon = require("../models/RegisterModel");


exports.savePurchase = async (req, res) => {
  try {
    const {
      purchaseDate,
      billNumber,
      branchId,
      branchName,
      salonId,
      paymentType,
      companyName,
      tableData,
      createdBy,
      modifiedBy,
      createdAt,
      modifiedAt
    } = req.body;

    // Validate required fields
    if (
      !purchaseDate ||
      !billNumber ||
      !branchId ||
      !branchName ||
      !salonId ||
      !tableData ||
      !createdBy ||
      !modifiedBy
    ) {
      // console.log('Validation failed:', req.body);
      return res.status(400).json({ error: 'Please fill all the required fields' });
    }

   
    const purchaseData = {
      purchaseDate,
      billNumber,
      branchId,
      branchName,
      salonId,
      paymentType,
      companyName,
      createdBy,
      createdAt: createdAt || new Date(),
      modifiedBy,
      modifiedAt: modifiedAt || new Date(),
      tableData: tableData.map(entry => ({
        product: entry.product,
        quantity: entry.quantity,
        cp: entry.cp,
      }))
    };

    const newPurchase = new PurchaseProduct(purchaseData);
    await newPurchase.save();

    res.status(201).json({ message: 'Purchase saved successfully', purchase: newPurchase });
  } catch (error) {
    console.error('Error saving purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.ReadStock = async (req, res) => {
  try {
    const { salon_id } = req.query; // Read salon_id from query parameters

    if (!salon_id) {
      return res.status(400).json({ message: 'Salon ID is required' });
    }

    const properties = await PurchaseProduct.find({ salonId: salon_id });
    if (!properties.length) {
      // return res.status(404).json({ message: 'No stock data found for the given salon ID' });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

