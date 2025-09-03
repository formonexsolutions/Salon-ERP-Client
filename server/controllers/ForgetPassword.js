const Staff = require('../models/StaffModel');
const { generateOtp, sendOtp } = require('../services/otpService');

// Endpoint to send OTP to the registered phone number
exports.sendOTP = async (req, res) => {
  const { mobilenumber } = req.body;

  try {
    // Check if the mobilenumber is registered in the database
    const user = await Staff.findOne({ phoneNumber: mobilenumber });

    if (!user) {
      return res.status(404).json({ message: 'Mobile number not found' });
    }

    // Generate OTP using centralized service
    const otp = generateOtp();

    // Send OTP via SMS using centralized service
    try {
      const result = await sendOtp(mobilenumber, otp);
      
      if (result.success || result.fallback) {
        // Save the OTP in the user's record in the database for verification
        user.otp = otp; // You may need to add an otp field to your Staff schema
        await user.save();

        return res.json({ 
          success: true, 
          message: result.fallback ? 'OTP sent (check server console)' : 'OTP sent successfully' 
        });
      } else {
        return res.status(500).json({ error: 'Failed to send OTP' });
      }
    } catch (otpError) {
      console.error('OTP sending error:', otpError.message);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint to verify the entered OTP
exports.verifyOTP = async (req, res) => {
  const { mobilenumber, otp } = req.body;

  try {
    // Check if the mobilenumber and otp match
    const user = await Staff.findOne({ phoneNumber: mobilenumber, otp });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP verification successful
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint to reset the password
exports.resetPassword = async (req, res) => {
  const { mobilenumber, newPassword } = req.body;

  try {
    // Find the user by mobilenumber
    const user = await Staff.findOne({ phoneNumber: mobilenumber });

    if (!user) {
      return res.status(404).json({ message: 'Mobile number not found' });
    }

    // Update the user's password
    user.password = newPassword; // Ensure to hash the password before saving it
    user.otp = undefined; // Clear the OTP field after password reset
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
