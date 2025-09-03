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

exports.registerSalon = async (req, res) => {
  try {
    const { SalonName, adminName, phoneNumber, gst, password, state, city, address, createdBy } = req.body;

    const existingStaff = await Staff.findOne({ phoneNumber });
    if (existingStaff) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

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
      otp,
    });
    await staff.save();
    
    // Send OTP to the user's mobile number via SMS
    let otpSent = false;
    try {
      const result = await sendOtp(phoneNumber, otp);
      otpSent = result.success || result.fallback; // Consider fallback as success for development
    } catch (err) {
      console.error('OTP sending threw error:', err.message);
    }
    
    if (!otpSent) {
      // For development/testing: Don't rollback, just return success with warning
      // In production, you might want to rollback on OTP failure
      console.log('OTP sending failed, but registration completed');
      return res.status(201).json({ 
        message: 'Salon registered successfully, but OTP could not be sent. Please contact support for verification.', 
        salon_id: salon.salon_id,
        otpSent: false,
        warning: 'OTP service temporarily unavailable'
      });
    }

    res.status(201).json({ 
      message: 'Salon registered successfully. OTP sent to phone.', 
      salon_id: salon.salon_id,
      otpSent: true 
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