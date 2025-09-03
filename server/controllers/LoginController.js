const Superadmin = require("../models/SuperAdminModel");
const Staff = require("../models/StaffModel");
const Employee = require("../models/EmployeeModel");
const Branch = require("../models/Branchmodel");
const Salon = require("../models/RegisterModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { generateOtp, sendOtp } = require("../services/otpService");

const generateJwtToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      salon_id: user.salon_id,
      staff_id: user.staff_id,
      adminName: user.adminName,
      employeeName: user.employeeName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
};

exports.salonAdminForgotPassword = async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    const user = await Staff.findOne({ phoneNumber: mobileNumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    const otp = generateOtp();
    user.otp = otp;
    await user.save();

    await sendOtp(mobileNumber, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.salonAdminResetPassword = async (req, res) => {
  const { mobileNumber, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await Staff.findOne({ phoneNumber: mobileNumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null; // Clear the OTP after successful password reset
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in password reset process:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.salonAdminVerifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    const user = await Staff.findOne({ phoneNumber: mobileNumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.otp = null; // Clear the OTP after successful verification
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.salonAdminLogin = async (req, res) => {
  const { mobilenumber, password } = req.body;

  try {
    const user = await Staff.findOne({ phoneNumber: mobilenumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    // Compare entered password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (user.status !== "AA") {
      return res.status(401).json({
        message:
          "Your status is deactivated. Please check with your superior for activation.",
      });
    }

    // Fetch salon details
    const salon = await Salon.findOne({ salon_id: user.salon_id });

    if (!salon) {
      return res
        .status(401)
        .json({ message: "Salon not found. Please contact SuperAdmin." });
    }

    if (salon.status !== "AA") {
      // Check if salon is inactive
      return res.status(401).json({
        message:
          "Your Subscription Might Have Ended. Please Contact SuperAdmin.",
      });
    }

    // Fetch employee details
    const employee = await Employee.findOne({
      staff_id: user.staff_id,
      salon_id: user.salon_id,
    });

    if (employee && employee.status !== "AA") {
      return res.status(401).json({
        message:
          "Your status is deactivated. Please check with your superior for activation.",
      });
    }

    // Generate JWT token
    const token = generateJwtToken(user);

    const responseData = {
      success: true,
      role: user.role,
      token: token,
      salon_id: user.salon_id,
      staff_id: user.staff_id,
      employeeName: employee ? employee.employeeName : user.employeeName,
      adminName: user.adminName,
      phoneNumber: user.phoneNumber,
    };

    // Fetch branch details using both branch_id and salon_id
    const branch = await Branch.findOne({
      branch_id: user.branch_id,
      salon_id: user.salon_id,
    });
    if (branch) {
      responseData.branch_id = branch.branch_id;
      responseData.branchName = branch.branchName;
      responseData.address = branch.address;
    } else {
      // Handle case where branch details are not found
      responseData.branch_id = "";
      responseData.branchName = "";
      responseData.address = "";
    }

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.superAdminLogin = async (req, res) => {
  const { mobilenumber, password } = req.body;

  try {
    const user = await Superadmin.findOne({
      phoneNumber: mobilenumber,
      role: "superAdmin",
    });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    // Compare entered password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (user.status !== "AA") {
      return res.status(401).json({
        message:
          "Your status is deactivated. Please check with your superior for activation.",
      });
    }

    // Generate JWT token
    const token = generateJwtToken(user);

    const responseData = {
      success: true,
      role: user.role,
      token: token,
      superAdminName: user.superAdminName,
      superAdminId: user.superAdminId,
      phoneNumber: user.phoneNumber,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.superAdminForgotPassword = async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    const user = await Superadmin.findOne({ phoneNumber: mobileNumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    const otp = generateOtp();
    user.otp = otp;
    await user.save();

    await sendOtp(mobileNumber, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.superAdminVerifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    const user = await Superadmin.findOne({ phoneNumber: mobileNumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.otp = null; // Clear the OTP after successful verification
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.superAdminResetPassword = async (req, res) => {
  const { mobileNumber, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await Superadmin.findOne({ phoneNumber: mobileNumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null; // Clear the OTP after successful password reset
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in password reset process:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// OTP Login methods
exports.salonAdminSendLoginOtp = async (req, res) => {
  const { mobilenumber } = req.body;

  try {
    const user = await Staff.findOne({ phoneNumber: mobilenumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    if (user.status !== "AA") {
      return res.status(401).json({
        message: "Your status is deactivated. Please check with your superior for activation.",
      });
    }

    // Fetch salon details
    const salon = await Salon.findOne({ salon_id: user.salon_id });

    if (!salon) {
      return res.status(401).json({ message: "Salon not found. Please contact SuperAdmin." });
    }

    if (salon.status !== "AA") {
      return res.status(401).json({
        message: "Your Subscription Might Have Ended. Please Contact SuperAdmin.",
      });
    }

    const otp = generateOtp();
    user.loginOtp = otp;
    await user.save();

    await sendOtp(mobilenumber, otp);

    res.json({ message: "OTP sent successfully for login" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.salonAdminLoginWithOtp = async (req, res) => {
  const { mobilenumber, otp } = req.body;

  try {
    const user = await Staff.findOne({ phoneNumber: mobilenumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    if (user.loginOtp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (user.status !== "AA") {
      return res.status(401).json({
        message: "Your status is deactivated. Please check with your superior for activation.",
      });
    }

    // Fetch salon details
    const salon = await Salon.findOne({ salon_id: user.salon_id });

    if (!salon) {
      return res.status(401).json({ message: "Salon not found. Please contact SuperAdmin." });
    }

    if (salon.status !== "AA") {
      return res.status(401).json({
        message: "Your Subscription Might Have Ended. Please Contact SuperAdmin.",
      });
    }

    // Fetch employee details
    const employee = await Employee.findOne({
      staff_id: user.staff_id,
      salon_id: user.salon_id,
    });

    if (employee && employee.status !== "AA") {
      return res.status(401).json({
        message: "Your status is deactivated. Please check with your superior for activation.",
      });
    }

    // Clear the login OTP after successful verification
    user.loginOtp = null;
    await user.save();

    // Generate JWT token
    const token = generateJwtToken(user);

    const responseData = {
      success: true,
      role: user.role,
      token: token,
      salon_id: user.salon_id,
      staff_id: user.staff_id,
      employeeName: employee ? employee.employeeName : user.employeeName,
      adminName: user.adminName,
      phoneNumber: user.phoneNumber,
    };

    // Fetch branch details using both branch_id and salon_id
    const branch = await Branch.findOne({
      branch_id: user.branch_id,
      salon_id: user.salon_id,
    });
    if (branch) {
      responseData.branch_id = branch.branch_id;
      responseData.branchName = branch.branchName;
      responseData.address = branch.address;
    } else {
      responseData.branch_id = "";
      responseData.branchName = "";
      responseData.address = "";
    }

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.superAdminSendLoginOtp = async (req, res) => {
  const { mobilenumber } = req.body;

  try {
    const user = await Superadmin.findOne({
      phoneNumber: mobilenumber,
      role: "superAdmin",
    });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    if (user.status !== "AA") {
      return res.status(401).json({
        message: "Your status is deactivated. Please check with your superior for activation.",
      });
    }

    const otp = generateOtp();
    user.loginOtp = otp;
    await user.save();

    await sendOtp(mobilenumber, otp);

    res.json({ message: "OTP sent successfully for login" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.superAdminLoginWithOtp = async (req, res) => {
  const { mobilenumber, otp } = req.body;

  try {
    const user = await Superadmin.findOne({
      phoneNumber: mobilenumber,
      role: "superAdmin",
    });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    if (user.loginOtp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (user.status !== "AA") {
      return res.status(401).json({
        message: "Your status is deactivated. Please check with your superior for activation.",
      });
    }

    // Clear the login OTP after successful verification
    user.loginOtp = null;
    await user.save();

    // Generate JWT token
    const token = generateJwtToken(user);

    const responseData = {
      success: true,
      role: user.role,
      token: token,
      superAdminName: user.superAdminName,
      superAdminId: user.superAdminId,
      phoneNumber: user.phoneNumber,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
