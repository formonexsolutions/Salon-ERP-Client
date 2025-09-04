const Salon = require('../models/RegisterModel');
const Staff = require('../models/StaffModel');
const moment = require('moment-timezone');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const State = require('../models/Statemodel');
const City = require('../models/Citymodel');
const Area = require('../models/Areamodel');
const { generateOtp, sendOtp } = require('../services/otpService');

const generateSalonID = async () => {
  const lastSalon = await Salon.findOne().sort({ createdAt: -1 });
  let salon_id = '';

  if (lastSalon) {
    const lastSalonID = parseInt(lastSalon.salon_id.substring(4));
    const nextSalonID = lastSalonID + 1;
    salon_id = `SALI${nextSalonID.toString().padStart(3, '0')}`;
  } else {
    salon_id = 'SALI001';
  } 

  return salon_id;
};

const generateStaffID = async (salon_id) => {
  // Find the staff with the highest staff_id globally (not salon-specific)
  const lastStaff = await Staff.findOne().sort({ staff_id: -1 });
  let staff_id = '';

  if (lastStaff && lastStaff.staff_id) {
    const lastStaffID = parseInt(lastStaff.staff_id.substring(4));
    const nextStaffID = lastStaffID + 1;
    staff_id = `STAF${nextStaffID.toString().padStart(3, '0')}`;
  } else {
    staff_id = 'STAF001';
  }

  return staff_id;
};

exports.changePassword = async (req, res) => {
  const { idUser, oldPassword, newPassword } = req.body;
  try {
    // Find the user by staff_id
    const user = await Staff.findOne({ staff_id: idUser });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect old password' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // Save the user with the new password
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getAllSalons = async (req, res) => {
try {
    const { page = 1, limit = 5 } = req.query; // Default to page 1, 5 items per page
    const skip = (page - 1) * limit;
    const total = await Salon.countDocuments();
    const salons = await Salon.find().skip(skip).limit(Number(limit));
    
    res.status(200).json({
      success: true,
      total,
      salons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching salons',
      error: error.message
    });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (error) {


    console.error('Error fetching staff data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.addStauts = async (req, res) => {
  const { id } = req.params;
    const { approvedstatus } = req.body;

    try {
        const updatedSalon = await Salon.findByIdAndUpdate(id, { approvedstatus }, { new: true }); // Update salon status
        if (!updatedSalon) {
            return res.status(404).json({ message: 'Salon not found' });
        }
        res.json(updatedSalon);
    } catch (error) {
        res.status(500).json({ message: 'Error updating salon status' });
    }
}

exports.fetchstatus = async (req, res) => {
  try {
      const salonData = await Salon.find(); // Fetch all salon data
      res.json(salonData);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching salon data' });
  }
};


exports.fetchApprovedSalon = async (req, res) => {
  try {
      const salonData = await Salon.find({ status: 'Approve' }); // Fetch all salon data with status "Approve"
      res.json(salonData);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching salon data' });
  }
};


exports.updateActivationStatus = async (req, res) => {
  try {
      const { salonId } = req.params;
      const { status } = req.body;

      // Find the salon by ID and update its activation status
      const updatedSalon = await Salon.findByIdAndUpdate(salonId, { status }, { new: true });

      res.status(200).json(updatedSalon);
  } catch (error) {
      console.error('Error updating salon activation status:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
exports.updateUsername = async (req, res) => {
  try {
    const { idUser, newUsername } = req.body;

    // Find the user by ID and update the username
    const updatedUser = await Staff.findOneAndUpdate(
      { staff_id: idUser },
      { adminName: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Username updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getStates = async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching states' });
  }
};
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAreasByCity = async (req, res) => {
  try {
    const { cityName } = req.query;
    const areas = await Area.find({ city: cityName });
    res.json(areas);
  } catch (error) {
    console.error('Error fetching areas by city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { idUser, oldPassword, newPassword, newUsername, role } = req.body;

    // Check if role is valid
    if (role !== 'admin' && role !== 'employee') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Select the model based on the role
    const model = role === 'admin' ? Staff : Employee;

    // Find user by ID and verify old password
    const user = await model.findOne({ staff_id: idUser });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Verify old password
    if (user.password !== oldPassword) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // Update password and username based on role
    user.password = newPassword;
    if (role === 'admin') {
      user.adminName = newUsername || user.adminName; // Update adminName only if provided
    } else {
      user.employeeName = newUsername || user.employeeName; // Update employeeName only if provided
    }
    user.modifiedAt = moment().tz('Asia/Kolkata').format();

    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    // console.error('Error updating profile:', error);
  }
}

// Step 1: Send OTP for phone verification during registration
exports.sendRegistrationOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Check if phone number is already registered
    const existingStaff = await Staff.findOne({ phoneNumber });
    if (existingStaff) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    // Generate OTP
    const otp = generateOtp();

    // Store OTP temporarily (you might want to use Redis or temporary collection)
    // For now, we'll store in memory or use a temporary field
    const tempOtpData = {
      phoneNumber,
      otp,
      timestamp: Date.now(),
      verified: false
    };

    // In production, use Redis or temporary database storage
    // For now, we'll store in a temporary collection or memory
    // Here we'll use a simple in-memory store (you should replace with Redis)
    global.registrationOtps = global.registrationOtps || new Map();
    global.registrationOtps.set(phoneNumber, tempOtpData);

    // Send OTP
    try {
      const result = await sendOtp(phoneNumber, otp);
      
      if (result.success || result.fallback) {
        return res.status(200).json({ 
          message: 'OTP sent successfully for registration verification',
          otpSent: true,
          phoneNumber: phoneNumber
        });
      } else {
        return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      console.error('OTP sending error:', error.message);
      return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }

  } catch (error) {
    console.error('Error in sendRegistrationOtp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Step 2: Verify OTP for registration
exports.verifyRegistrationOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    // Get stored OTP data
    global.registrationOtps = global.registrationOtps || new Map();
    const storedOtpData = global.registrationOtps.get(phoneNumber);

    if (!storedOtpData) {
      return res.status(400).json({ error: 'OTP not found or expired. Please request a new OTP.' });
    }

    // Check OTP expiry (5 minutes)
    const otpAge = Date.now() - storedOtpData.timestamp;
    const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (otpAge > otpExpiryTime) {
      global.registrationOtps.delete(phoneNumber);
      return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }

    // Mark as verified
    storedOtpData.verified = true;
    global.registrationOtps.set(phoneNumber, storedOtpData);

    res.status(200).json({ 
      message: 'Phone number verified successfully. You can now complete registration.',
      verified: true,
      phoneNumber: phoneNumber
    });

  } catch (error) {
    console.error('Error in verifyRegistrationOtp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Step 3: Complete salon registration (only after OTP verification)
exports.registerSalon = async (req, res) => {
  try {
    const { SalonName, adminName, phoneNumber, gst, password, state, city, address, createdBy } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Check if phone number is verified
    global.registrationOtps = global.registrationOtps || new Map();
    const otpData = global.registrationOtps.get(phoneNumber);

    if (!otpData || !otpData.verified) {
      return res.status(400).json({ 
        error: 'Phone number not verified. Please verify your phone number with OTP first.',
        requiresOtpVerification: true
      });
    }

    // Check OTP verification age (allow 10 minutes after verification)
    const verificationAge = Date.now() - otpData.timestamp;
    const verificationExpiryTime = 10 * 60 * 1000; // 10 minutes

    if (verificationAge > verificationExpiryTime) {
      global.registrationOtps.delete(phoneNumber);
      return res.status(400).json({ 
        error: 'Phone verification expired. Please verify your phone number again.',
        requiresOtpVerification: true
      });
    }

    // Double-check if phone number is already registered
    const existingStaff = await Staff.findOne({ phoneNumber });
    if (existingStaff) {
      global.registrationOtps.delete(phoneNumber);
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const salon_id = await generateSalonID();
    const salon = new Salon({
      SalonName,
      adminName,
      gst,
      state,
      city,
      address,
      salon_id,
      createdBy,
      createdAt: moment().tz('Asia/Kolkata').format(),
    });
    await salon.save();

    const staff_id = await generateStaffID(salon_id);
    const staff = new Staff({
      adminName,
      phoneNumber,
      password: hashedPassword,
      staff_id,
      role: 'admin',
      createdBy,
      createdAt: moment().tz('Asia/Kolkata').format(),
      salon_id, // Store salon_id in staff collection
      phoneVerified: true, // Mark as verified
    });
    await staff.save();
    
    // Clean up OTP data after successful registration
    global.registrationOtps.delete(phoneNumber);

    res.status(201).json({ 
      message: 'Salon registered successfully with verified phone number!', 
      salon_id: salon.salon_id,
      verified: true,
      success: true
    });

  } catch (error) {
    console.error('Error registering salon:', error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.staff_id) {
      return res.status(400).json({ error: 'Duplicate staff_id' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
// ...existing code...


// ...existing code...

exports.getStaffByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    const staff = await Staff.findOne({ phoneNumber });
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff by phone number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchGSTBySalonId = async (req, res) => {
  try {
    const { salonId } = req.params;
    if (!salonId) {
      return res.status(400).json({ error: "Salon ID is required" });
    }
    const salon = await Salon.findOne({ salon_id: salonId });
    if (!salon) {
      return res.status(404).json({ error: "Salon not found" });
    }
    res.json({ gst: salon.gst });
  } catch (error) {
    console.error("Error fetching GST by salon ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ...existing code...