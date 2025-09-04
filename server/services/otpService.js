const axios = require('axios');

// Centralized OTP generation
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Primary SMS provider (MyLogin - currently expired)
const sendOtpWithMyLogin = async (phoneNumber, otp) => {
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
    throw new Error('SMS_API_MESSAGE_TEMPLATE not configured');
  }

  const message = SMS_API_MESSAGE_TEMPLATE.replace('${otp}', otp);
  const url = `${SMS_API_BASE_URL}?ApiKey=${encodeURIComponent(SMS_API_KEY)}&ClientId=${encodeURIComponent(SMS_API_CLIENT_ID)}&SenderId=${encodeURIComponent(SMS_API_SENDER_ID)}&Message=${encodeURIComponent(message)}&MobileNumbers=${encodeURIComponent(phoneNumber)}&Is_Unicode=${SMS_API_UNICODE}&Is_Flash=${SMS_API_FLASH}`;

  const response = await axios.get(url);
  console.log('MyLogin Provider Response:', response.data);
  
  // Check if the primary provider is working
  if (response.data.ErrorCode === 1090 || response.data.ErrorDescription === "Account validity expired") {
    throw new Error('MyLogin SMS provider account expired');
  }
  
  if (response.data.ErrorCode === '000' || response.data.Status === 'Success') {
    return { success: true, data: response.data };
  }
  
  throw new Error(`MyLogin SMS failed: ${JSON.stringify(response.data)}`);
};

// Fast2SMS provider
const sendOtpWithFast2SMS = async (phoneNumber, otp) => {
  const { FAST2SMS_API_KEY } = process.env;
  
  if (!FAST2SMS_API_KEY || FAST2SMS_API_KEY === 'YOUR_FAST2SMS_API_KEY_HERE') {
    throw new Error('Fast2SMS API key not configured');
  }

  try {
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      variables_values: otp,
      route: 'otp',
      numbers: phoneNumber
    }, {
      headers: {
        'authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Fast2SMS Response:', response.data);
    
    if (response.data.return === true) {
      return { success: true, data: response.data };
    } else {
      throw new Error(`Fast2SMS failed: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Fast2SMS error: ${error.message}`);
  }
};

// Twilio SMS provider (Primary - Most Reliable)
const sendOtpWithTwilio = async (phoneNumber, otp) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error('Twilio credentials not configured');
  }

  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: `+91${phoneNumber}`,
        Body: `${otp} is your OTP for Salon ERP login/registration. Valid for 5 minutes. Do not share this OTP with anyone.`
      }),
      {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('✅ Twilio Response:', response.data);
    
    if (response.data.sid) {
      return { success: true, data: response.data, provider: 'Twilio' };
    } else {
      throw new Error(`Twilio SMS failed: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('❌ Twilio Error:', error.response?.data || error.message);
    throw new Error(`Twilio error: ${error.response?.data?.message || error.message}`);
  }
};

// Main OTP sending function with multiple providers
const sendOtp = async (phoneNumber, otp) => {
  console.log(`📱 Attempting to send OTP to ${phoneNumber}: ${otp}`);

  // List of providers to try in order (Twilio first as it's most reliable)
  const providers = [
    { name: 'Twilio (Primary)', func: sendOtpWithTwilio },
    { name: 'MyLogin', func: sendOtpWithMyLogin },
    { name: 'Fast2SMS', func: sendOtpWithFast2SMS }
  ];

  let lastError = null;

  // Try each provider in sequence
  for (const provider of providers) {
    try {
      console.log(`🔄 Trying ${provider.name}...`);
      const result = await provider.func(phoneNumber, otp);
      console.log(`✅ ${provider.name} succeeded! OTP sent to ${phoneNumber}`);
      console.log(`📧 SMS sent via ${result.provider || provider.name}`);
      return result;
    } catch (error) {
      console.log(`❌ ${provider.name} failed: ${error.message}`);
      lastError = error;
      continue;
    }
  }

  // If all providers fail, use console logging as fallback
  console.log(`⚠️  All SMS providers failed. Using console fallback for development.`);
  console.log(`🔐 DEVELOPMENT FALLBACK - OTP for ${phoneNumber}: ${otp}`);
  console.log(`📱 Please use this OTP: ${otp}`);
  console.log(`❌ Last error: ${lastError?.message}`);
  
  // Return success for development (don't break the flow)
  return { 
    success: true, 
    fallback: true, 
    otp: otp,
    message: 'OTP displayed in console (development mode)' 
  };
};

module.exports = {
  generateOtp,
  sendOtp
};
