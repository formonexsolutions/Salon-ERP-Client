const { generateOtp, sendOtp } = require('./services/otpService');

const testOtpSystem = async () => {
  console.log('🧪 Testing Centralized OTP System...\n');

  try {
    // Test OTP generation
    const otp = generateOtp();
    console.log('✅ OTP Generation:', otp);

    // Test OTP sending to test number
    console.log('\n📱 Testing OTP sending...');
    const result = await sendOtp('9148115647', otp);
    console.log('✅ OTP Send Result:', result);

    if (result.fallback) {
      console.log('\n🎉 SUCCESS: OTP system working with console fallback!');
      console.log('📋 To get real SMS: Add Fast2SMS or TextLocal API key to .env');
    } else if (result.success) {
      console.log('\n🎉 SUCCESS: OTP sent via SMS provider!');
    }

  } catch (error) {
    console.error('❌ OTP System Error:', error.message);
  }
};

// Run the test
testOtpSystem();
