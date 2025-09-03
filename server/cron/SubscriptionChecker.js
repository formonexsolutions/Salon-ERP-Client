const cron = require('node-cron');
const Salon = require('../models/RegisterModel');
const Payment = require('../models/paymentModel');
const moment = require('moment-timezone');

// Function to check for expired subscriptions and update status
const checkAndDeactivateExpiredSalons = async () => {
  try {
    const currentDate = moment().tz('Asia/Kolkata').startOf('minute').toDate(); // Ensure to start of minute for accurate comparison
    // console.log('Current date:', currentDate);
    
    const expiredSalons = await Payment.find({ subscription_expiryDate: { $lte: currentDate } });
    // console.log(`Found ${expiredSalons.length} expired salons`);

    for (const payment of expiredSalons) {
      console.log(`Processing salon ${payment.salon_id} with expiry date ${payment.subscription_expiryDate}`);
      await Salon.updateOne(
        { salon_id: payment.salon_id },
        { $set: { status: 'IA' } },
        { runValidators: false }
      );
    //   console.log(`Salon ${payment.salon_id} has been deactivated due to expired subscription.`);
    }
  } catch (error) {
    console.error('Error checking for expired subscriptions:', error);
  }
};

// Schedule the function to run daily at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running daily subscription expiry check');
    checkAndDeactivateExpiredSalons();
  });

module.exports = checkAndDeactivateExpiredSalons;
