const { response } = require("express");
const Offer = require("../models/offerSuperAdminModel");
const fs = require("fs");
const path = require("path");

// Get all offers
exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new offer
exports.createOffer = async (req, res) => {
  const { productName, description, createdBy } = req.body;
  let image = req.file.path;

  // Replace backslashes with forward slashes
  image = image.replace(/\\/g, "/");

  try {
    const newOffer = new Offer({
      productName,
      description,
      image,
      createdBy,
      interested: "no",
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const imagePath = path.join(__dirname, "..", offer.image);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      console.warn(`Image file not found: ${imagePath}`);
    }

    await Offer.findByIdAndDelete(id);

    res.json({ message: "Offer deleted successfully" });
  } catch (err) {
    console.error("Error deleting offer:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.addInterest = async (req, res) => {
  const { name, phoneNumber, offerId, productName } = req.body;

  try {
      const offer = await Offer.findById(offerId);
      if (!offer) {
          return res.status(404).json({ message: "Offer not found" });
      }
      // Validate productName before pushing
      if (!productName) {
          return res.status(400).json({ message: "Product name is required" });
      }

      // Update interestedUsers array with new user
      offer.interestedUsers.push({ name, phoneNumber, productName });
      offer.interested = "yes"; // Update offer's interest status to 'yes'
      await offer.save();

      res.status(201).json({
          message: "Interest added successfully",
          productName: offer.productName, // Include productName in the response
      });
  } catch (err) {
      console.error("Error adding interest:", err);
      res.status(500).json({ message: err.message });
  }
};


exports.getInterestedUsers = async (req, res) => {
  const { offerId } = req.params;

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Return the interestedUsers array
    res.status(200).json(offer.interestedUsers);
  } catch (err) {
    console.error("Error fetching interested users:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.addInterest = async (req, res) => {
  const { name, phoneNumber, offerId, productName } = req.body;

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Validate productName before pushing
    if (!productName) {
      return res.status(400).json({ message: "Product name is required" });
    }

    // Get the current date and time
    const interestedDate = new Date();

    // Update interestedUsers array with new user
    offer.interestedUsers.push({ name, phoneNumber, productName, interestedDate });
    offer.interested = "yes"; // Update offer's interest status to 'yes'
    await offer.save();

    res.status(201).json({
      message: "Interest added successfully",
      productName: offer.productName, // Include productName in the response
    });
  } catch (err) {
    console.error("Error adding interest:", err);
    res.status(500).json({ message: err.message });
  }
};





