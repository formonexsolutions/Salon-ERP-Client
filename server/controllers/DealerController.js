const Dealer = require('../models/DealerModel');
// const bcrypt = require('bcryptjs');
const axios = require('axios');
const State = require('../models/Statemodel');
const City = require('../models/Citymodel');
const Area = require('../models/Areamodel');
const moment = require('moment-timezone');
// Function to generate a 6-digit OTP

const generateDealerID = async () => {
  const lastDealer = await Dealer.findOne().sort({ dealer_id: -1 });
  let dealer_id = '';

  if (lastDealer && lastDealer.dealer_id) {
    const lastDealerID = parseInt(lastDealer.dealer_id.substring(4));
    const nextDealerID = lastDealerID + 1;
    dealer_id = `DEAL${nextDealerID.toString().padStart(3, '0')}`;
  } else {
    dealer_id = 'DEAL001';
  }

  return dealer_id;
};
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Function to send OTP via SMS using API
  // const sendOTP = async (phoneNumber, otp) => {
  //   const {
  //     SMS_API_BASE_URL,
  //     SMS_API_KEY,
  //     SMS_API_CLIENT_ID,
  //     SMS_API_SENDER_ID,
  //     SMS_API_MESSAGE_TEMPLATE,
  //     SMS_API_UNICODE,
  //     SMS_API_FLASH
  //   } = process.env;
  
  //   if (!SMS_API_MESSAGE_TEMPLATE) {
  //     console.error('SMS_API_MESSAGE_TEMPLATE is not defined in environment variables.');
  //     throw new Error('SMS API message template is missing.');
  //   }
  
  //   const message = SMS_API_MESSAGE_TEMPLATE.replace('${otp}', otp);
  
  //   const url = `${SMS_API_BASE_URL}?ApiKey=${encodeURIComponent(SMS_API_KEY)}&ClientId=${encodeURIComponent(SMS_API_CLIENT_ID)}&SenderId=${encodeURIComponent(SMS_API_SENDER_ID)}&Message=${encodeURIComponent(message)}&MobileNumbers=${encodeURIComponent(phoneNumber)}&Is_Unicode=${SMS_API_UNICODE}&Is_Flash=${SMS_API_FLASH}`;
  
  //   try {
  //     const response = await axios.get(url);
  //     if (response.status === 200 && response.data.Status === 'Success') {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Error sending OTP:', error);
  //     throw new Error('Failed to send OTP');
  //   }
  // };
  const sendOTP = async (phoneNumber, otp) => {
    const {
      SMS_API_BASE_URL,
      SMS_API_KEY,
      SMS_API_CLIENT_ID,
      SMS_API_SENDER_ID,
      SMS_API_MESSAGE_TEMPLATE,
      SMS_API_UNICODE,
      SMS_API_FLASH
    } = process.env;
  
    if (!SMS_API_MESSAGE_TEMPLATE) {
      // console.error('SMS_API_MESSAGE_TEMPLATE is not defined in environment variables.');
      throw new Error('SMS API message template is missing.');
    }
  
    // Add country code if missing
    if (!phoneNumber.startsWith('91')) {
      phoneNumber = `91${phoneNumber}`;
    }
  
    const message = SMS_API_MESSAGE_TEMPLATE.replace('${otp}', otp);
  
    const url = `${SMS_API_BASE_URL}?ApiKey=${encodeURIComponent(SMS_API_KEY)}&ClientId=${encodeURIComponent(SMS_API_CLIENT_ID)}&SenderId=${encodeURIComponent(SMS_API_SENDER_ID)}&Message=${encodeURIComponent(message)}&MobileNumbers=${encodeURIComponent(phoneNumber)}&Is_Unicode=${SMS_API_UNICODE}&Is_Flash=${SMS_API_FLASH}`;
  
    try {
      const response = await axios.get(url);
      // console.log('SMS API Response:', response.data);
  
      // Check if the response indicates success
      const isSuccess = response.data.Data.every(
        item => item.MessageErrorCode === 0
      );
  
      if (isSuccess) {
        return true;
      } else {
        console.error('SMS API Error:', response.data);
        return false;
      }
    } catch (error) {
      // console.error('Error sending OTP:', error.response ? error.response.data : error.message);
      throw new Error('Failed to send OTP');
    }
  };
  
  exports.sendOTP = async (req, res) => {
    try {
      const { phoneNumber } = req.body;
  
      const dealer = await Dealer.findOne({ phoneNumber });
      if (!dealer) {
        return res.status(404).json({ error: 'Dealer not found' });
      }
  
      const otp = generateOTP();
      // console.log(`Generated OTP: ${otp}`);
  
      const otpSent = await sendOTP(phoneNumber, otp);
      if (!otpSent) {
        return res.status(500).json({ error: 'Failed to send OTP' });
      }
  
      dealer.otp = otp;
      dealer.otpStatus = 'OS';
      dealer.otpSent = true;
      dealer.resendCount += 1;
      await dealer.save();
  
      res.status(200).json({ message: 'OTP sent successfully', otp: otp });
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
// Register a new dealer
// const registerDealer = async (req, res) => {
//     try {
//         const { DealerName, CompanyName, phoneNumber, password, state, city, area } = req.body;

//         // Check if dealer already exists
//         const existingDealer = await Dealer.findOne({ phoneNumber });
//         if (existingDealer) {
//             return res.status(400).json({ error: 'Dealer already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Generate OTP
//         const otp = generateOTP();
//         console.log(`Generated OTP: ${otp}`);

//         // Create new dealer
//         const newDealer = new Dealer({
//             DealerName,
//             CompanyName,
//             phoneNumber,
//             password: hashedPassword,
//             state,
//             city,
//             area,
//             otp,
//             otpStatus: 'OS', // OTP Sent status
//             otpSent: true, // OTP Sent flag
//             resendCount: 0 // Initialize resend count
//         });

//         await newDealer.save();

//         // Send OTP via SMS
//         const otpSent = await sendOTP(phoneNumber, otp);
//         // if (!otpSent) {
//         //     console.error('Failed to send OTP via SMS.');
//         //     return res.status(500).json({ error: 'Failed to send OTP' });
//         // }

//         res.status(201).json({ message: 'Registered successfully! OTP sent.', dealer_id: newDealer._id });
//     } catch (error) {
//         console.error("Error in registerDealer:", error.message);
//         if (error.code === 11000) {
//             return res.status(400).json({ error: 'Duplicate entry' });
//         }
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
const registerDealer = async (req, res) => {
  try {
    const { DealerName, CompanyName, phoneNumber, password, state, city, area } = req.body;

    // Check if dealer already exists
    const existingDealer = await Dealer.findOne({ phoneNumber });
    if (existingDealer) {
      return res.status(400).json({ error: 'Dealer already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    // console.log(`Generated OTP: ${otp}`);

    // Generate unique dealer_id
    const dealer_id = await generateDealerID();

    // Create new dealer
    const newDealer = new Dealer({
      dealer_id,
      DealerName,
      CompanyName,
      phoneNumber,
      password,
      state,
      city,
      area,
      otp,
      otpStatus: 'OS', // OTP Sent status
      otpSent: true, // OTP Sent flag
      resendCount: 0 // Initialize resend count
    });

    await newDealer.save();

    // Send OTP via SMS
    const otpSent = await sendOTP(phoneNumber, otp);
    if (!otpSent) {
      console.error('Failed to send OTP via SMS.');
      return res.status(500).json({ error: 'Failed to send OTP' });
    }

    res.status(201).json({ message: 'Registered successfully! OTP sent.', dealer_id: newDealer.dealer_id });
  } catch (error) {
    console.error("Error in registerDealer:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate entry' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify OTP
// const verifyOtp = async (req, res) => {
//   try {
//     const { phoneNumber, otp } = req.body;

//     if (!phoneNumber || !otp) {
//       return res.status(400).json({ error: 'Phone number and OTP are required' });
//     }

//     const dealer = await Dealer.findOne({ phoneNumber });

//     if (!dealer) {
//       return res.status(400).json({ error: 'Dealer not found' });
//     }

//     if (dealer.otp !== otp) {
//       return res.status(400).json({ error: 'Invalid OTP' });
//     }

//     dealer.otpStatus = 'Verified';
//     dealer.otpSent = false;
//     dealer.otp = null;
//     await dealer.save();

//     res.status(200).json({ success: true, message: 'OTP verified successfully', phoneNumber });
//   } catch (error) {
//     console.error("Error in verifyOtp:", error);
//     res.status(500).json({ error: 'Failed to verify OTP' });
//   }
// };

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const dealer = await Dealer.findOne({ phoneNumber });

    if (!dealer) {
      return res.status(400).json({ error: 'Dealer not found' });
    }

    if (dealer.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    dealer.otpStatus = 'Verified';
    dealer.otpSent = false;
    dealer.otp = null;
    await dealer.save();

    res.status(200).json({ success: true, message: 'OTP verified successfully', phoneNumber });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};
// Get all dealers
const getAllDealers = async (req, res) => {
  try {
      const { page = 1, limit = 5 } = req.query; // Default to page 1, 5 items per page
      const skip = (page - 1) * limit;
      const total = await Dealer.countDocuments();
      const dealers = await Dealer.find().skip(skip).limit(Number(limit));
      
      res.status(200).json({
          success: true,
          total,
          dealers
      });
  } catch (error) {
      console.error("Error fetching dealers:", error);
      res.status(500).json({
          success: false,
          message: 'Failed to fetch dealers',
          error: error.message
      });
    }
};

// Get dealer by phone number
const getDealerByPhoneNumber = async (req, res) => {
    try {
        const dealer = await Dealer.findOne({ phoneNumber: req.params.phoneNumber });
        if (!dealer) {
            return res.status(404).json({ error: 'Dealer not found' });
        }
        res.status(200).json(dealer);
    } catch (error) {
        console.error("Error fetching dealer:", error);
        res.status(500).json({ error: 'Failed to fetch dealer' });
    }
};
const addStauts = async (req, res) => {
  const { id } = req.params;
    const { approvedstatus } = req.body;

    try {
        const updatedDealer = await Dealer.findByIdAndUpdate(id, { approvedstatus }, { new: true }); // Update salon status
        if (!updatedDealer) {
            return res.status(404).json({ message: 'Dealer not found' });
        }
        res.json(updatedDealer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating Dealer status' });
    }
}
const dealerLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;
  // console.log('Received login request:', { phoneNumber, password });

  try {
    const user = await Dealer.findOne({ phoneNumber });
    // console.log('Database query result:', user);

    if (!user) {
      // console.log('Mobile number not registered');
      return res.status(401).json({
        message: 'Mobile number is not registered. Please try again.',
      });
    }

    // Direct password comparison (no bcrypt)
    if (password !== user.password) {
      // console.log('Incorrect password for user:', phoneNumber);
      return res.status(401).json({
        message: 'Incorrect password. Please try again.',
      });
    }
    if (user.status !== "AA") {
      return res.status(401).json({
        message:
          "Your Account status is in deactivate. Please Contact  your SuperAdmin for the activation.",
      });
    }


    // If login is successful, respond with the dealer's information
    res.status(200).json({
      success: true,
      message: 'Login successful',
      dealer_id: user.dealer_id,
      DealerName: user.DealerName,
      CompanyName: user.CompanyName,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error('Error in dealerLogin:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const dealerForgotPassword = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await Dealer.findOne({ phoneNumber});

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }
    // Function to generate a 6-digit OTP


    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    await sendOTP(phoneNumber, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const dealerVerifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // console.log('Received mobileNumber:', phoneNumber);
    // console.log('Received OTP:', otp);

    const user = await Dealer.findOne({ phoneNumber});

    if (!user) {
      // console.log('User not found for mobileNumber:', phoneNumber);
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    if (user.otp !== otp) {
      // console.log('Invalid OTP. Expected:', user.otp, 'Received:', otp);
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.otp = null; // Clear OTP after successful verification
    await user.save();

    // console.log('OTP verified successfully for mobileNumber:', phoneNumber);
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const dealerResetPassword = async (req, res) => {
  const { phoneNumber, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await Dealer.findOne({ phoneNumber });

    if (!user) {
      return res.status(401).json({
        message: "Mobile number is not registered. Please try again.",
      });
    }

    // Directly assign the new password
    user.password = newPassword;
    user.otp = null; // Clear the OTP after successful password reset
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in password reset process:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateActivationStatus = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const { status } = req.body;

    // console.log('Received dealerId:', dealerId);
    // console.log('Received status:', status); 

    const updatedDealer = await Dealer.findByIdAndUpdate(
      dealerId,
      { status: status },
      { new: true }
    );

    if (!updatedDealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    res.status(200).json({ message: 'Activation status updated', dealer: updatedDealer });
  } catch (error) {
    console.error('Error updating activation status:', error); // Debugging log
    res.status(500).json({ message: 'Server error', error });
  }
};

const getDistinctStates = async (req, res) => {
  try {
    const states = await Dealer.distinct('state');
    res.status(200).json({
      success: true,
      states
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch states',
      error: error.message
    });
  }
};
const getCitiesByState = async (req, res) => {
  const { state } = req.query;
  if (!state) {
    return res.status(400).json({
      success: false,
      message: 'State query parameter is required'
    });
  }

  try {
    // Find distinct cities for the given state
    const cities = await Dealer.find({ state }).distinct('city');
    res.status(200).json({
      success: true,
      cities
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error.message
    });
  }
};

const getAreasByStateAndCity = async (req, res) => {
  const { state, city } = req.query;

  if (!state || !city) {
    return res.status(400).json({
      success: false,
      message: 'State and city query parameters are required'
    });
  }

  try {
    // Find distinct areas for the given state and city
    const areas = await Dealer.find({ state, city }).distinct('area');
    res.status(200).json({
      success: true,
      areas
    });
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch areas',
      error: error.message
    });
  }
};

// const getDealersByLocation = async (req, res) => {
//   const { state, city, area } = req.query;

//   if (!state || !city || !area) {
//     return res.status(400).json({
//       success: false,
//       message: 'State, city, and area query parameters are required'
//     });
//   }

//   try {
//     // Find dealers for the given state, city, and area
//     const dealers = await Dealer.find({ state, city, area });
//     res.status(200).json({
//       success: true,
//       dealers
//     });
//   } catch (error) {
//     console.error("Error fetching dealers:", error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dealers',
//       error: error.message
//     });
//   }
// };
const getDealersByStateCityArea = async (req, res) => {
  const { state, city, area } = req.query;

  if (!state || !city || !area) {
    return res.status(400).json({
      success: false,
      message: 'State, city, and area query parameters are required'
    });
  }

  try {
    // Find the dealers for the given state, city, and area
    const dealers = await Dealer.find({ state, city, area });
    if (!dealers.length) {
      return res.status(404).json({
        success: false,
        message: 'No dealers found for the provided state, city, and area'
      });
    }

    res.status(200).json({
      success: true,
      dealers
    });
  } catch (error) {
    console.error("Error fetching dealers:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dealers',
      error: error.message
    });
  }
};
const getDealerById = async (req, res) => {
  const { dealerId } = req.params;

  try {
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found'
      });
    }

    res.status(200).json({
      success: true,
      dealer
    });
  } catch (error) {
    console.error("Error fetching dealer:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dealer',
      error: error.message
    });
  }
};

const importDealers = async (req, res) => {
  try {
      const { dealers } = req.body;

      // Save dealers to the database
      const savedDealers = await Dealer.insertMany(dealers);
      res.status(200).json({ message: "Dealers imported successfully", savedDealers });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to import dealers", error });
  }
};


module.exports = { registerDealer,
  dealerLogin,
  dealerForgotPassword,
  dealerVerifyOtp,
  dealerResetPassword,
  getAllDealers,
  getDealerByPhoneNumber,verifyOtp,addStauts,updateActivationStatus,getDistinctStates,getCitiesByState, getAreasByStateAndCity, getDealersByStateCityArea,getDealerById,importDealers}

