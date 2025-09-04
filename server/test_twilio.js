require('dotenv').config();
const { generateOtp, sendOtp } = require('./services/otpService');

const testTwilioOtp = async () => {
  console.log('🧪 Testing Twilio OTP System...\n');

  try {
    // Test OTP generation
    const otp = generateOtp();
    console.log('✅ OTP Generated:', otp);

    // Test phone number (replace with your actual number for testing)
    const testPhoneNumber = '9148115647'; // Super admin number
    
    console.log('\n📱 Testing Twilio SMS sending...');
    console.log(`📞 Sending OTP ${otp} to +91${testPhoneNumber}`);
    
    const result = await sendOtp(testPhoneNumber, otp);
    
    if (result.success && !result.fallback) {
      console.log('\n🎉 SUCCESS: Twilio SMS sent successfully!');
      console.log('📧 Provider:', result.provider);
      console.log('📱 Check your phone for the OTP message');
      console.log('📋 Message SID:', result.data?.sid);
    } else if (result.fallback) {
      console.log('\n⚠️  Twilio failed, using console fallback');
      console.log('🔧 Check Twilio credentials and account status');
    }

  } catch (error) {
    console.error('\n❌ OTP System Error:', error.message);
    console.error('🔧 Please check your Twilio configuration in .env file');
  }

  console.log('\n📋 Twilio Configuration Check:');
  console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
  console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
  console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? '✅ Set' : '❌ Missing');
};

// Run the test
testTwilioOtp();
