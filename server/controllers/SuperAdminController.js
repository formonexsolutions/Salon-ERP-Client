
const SuperAdmin = require('../models/SuperAdminModel');
const bcrypt = require("bcryptjs");

// Helper function to generate the new ID
const generateSuperAdminId = async () => {
  const lastSuperAdmin = await SuperAdmin.findOne().sort({ createdAt: -1 });
  let newIdNumber = 1;

  if (lastSuperAdmin && lastSuperAdmin.superAdminId) {
    const lastIdNumber = parseInt(lastSuperAdmin.superAdminId.slice(4), 10);
    newIdNumber = lastIdNumber + 1;
  }

  const newIdString = newIdNumber.toString().padStart(3, '0');
  return `SUPA${newIdString}`;
};

exports.createSuperAdmin = async (req, res) => {
  const { superAdminName, phoneNumber, password, confirmpassword, createdBy, createdAt, status } = req.body;
  
  try {
    // Check if username already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ superAdminName });
    if (existingSuperAdmin) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if passwords match
    if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const superAdminId = await generateSuperAdminId();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSuperAdmin = new SuperAdmin({
      superAdminId,
      superAdminName,
      phoneNumber,
      password: hashedPassword,
      confirmpassword: hashedPassword,
      role: 'superAdmin',
      createdBy,
      createdAt,
      status: 'IA', // Default status for new super admins
      modifiedBy: 'None', // Set modifiedBy to default value
    });

    await newSuperAdmin.save();
    res.status(201).json({ message: 'SuperAdmin created successfully', data: newSuperAdmin });
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
    res.status(500).json({ error: 'Error creating SuperAdmin' });
  }
};

exports.fetchSuperAdmins = async (req, res) => {
  try {
    const superAdmins = await SuperAdmin.find().select('-password'); // Exclude password from the response
    res.status(200).json(superAdmins);
  } catch (error) {
    console.error('Error fetching SuperAdmins:', error);
    res.status(500).json({ error: 'Error fetching SuperAdmins' });
  }
};


exports.updateStatus = async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedSuperadmin = await SuperAdmin.findByIdAndUpdate(id, { status }, { new: true });

      if (!updatedSuperadmin) {
        return res.status(404).json({ error: 'SuperAdmin not found' });
      }

      res.status(200).json(updatedSuperadmin);
  } catch (error) {
      console.error('Error updating superadmin activation status:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatePhoneNumber = async (req, res) => {
  const { currentMobileNumber, newMobileNumber } = req.body;

  try {
    const user = await SuperAdmin.findOne({ phoneNumber: currentMobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User with current phone number not found' });
    }

    user.phoneNumber = newMobileNumber;
    await user.save();

    res.status(200).json({ message: 'Phone number updated successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  const { phoneNumber, oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }

  try {
    const user = await SuperAdmin.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};