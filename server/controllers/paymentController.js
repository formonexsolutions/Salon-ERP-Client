const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/paymentModel');
const Salon = require('../models/RegisterModel');
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../config/.env") });

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getRazorpayKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

exports.checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: 'INR',
  };

  try {
    const order = await instance.orders.create(options);

    const salon = await Salon.findOne().sort({ createdAt: -1 });
    const salon_id = salon ? salon.salon_id : 'UNKNOWN';

    res.status(200).json({ success: true, order, salon_id });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInitialPaymentRecord = async (req, res) => {
  const { salon_id, phoneNumber } = req.body;

  try {
    
    const latestPayment = await Payment.findOne().sort({ createdAt: -1 });

    // console.log("Latest Payment:", latestPayment);

    let nextSubscriptionId = 'SUBR001'; // Default starting subscription_id if no previous record exists

    if (latestPayment) {
      // Extract the subscription_id and increment the number part
      const lastSubscriptionId = latestPayment.subscription_id;
      const lastNumber = parseInt(lastSubscriptionId.substring(4));
      nextSubscriptionId = `SUBR${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // console.log("Next Subscription ID:", nextSubscriptionId);

    // Create initial payment record for the new salon
    const payment = await Payment.create({
      orderId: '', // Initialize with empty values
      paymentId: '',
      amount: 0,
      currency: '',
      salon_id: salon_id,
      phoneNumber: phoneNumber, // Include phoneNumber here
      subscription_id: nextSubscriptionId,
      subscription_startDate: null, // Set to null or remove these fields
      subscription_expiryDate: null, // Set to null or remove these fields
      status: 'Pending',
    });

    // console.log("Created Payment Record:", payment);

    res.status(200).json({ success: true, subscription_id: nextSubscriptionId, salon_id });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.subscription_id === 1) {
      // Handle duplicate key error specifically for subscription_id
      console.error("Duplicate subscription_id error:", error.message);
      res.status(409).json({ success: false, message: "Subscription ID already exists. Please try again." });
    } else {
      console.error("Error creating initial payment record:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

exports.paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, salon_id, phoneNumber } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !salon_id || !phoneNumber) {
      console.error('Missing required fields:', { razorpay_order_id, razorpay_payment_id, razorpay_signature, salon_id, phoneNumber });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // console.log('Expected Signature:', expectedSignature);
    // console.log('Received Signature:', razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error('Invalid signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    let payment = await Payment.findOne({ salon_id, phoneNumber });

    if (!payment) {
      console.error('Payment record not found for this salon_id and phoneNumber:', { salon_id, phoneNumber });
      return res.status(404).json({ success: false, message: 'Payment record not found for this salon_id and phoneNumber' });
    }

    payment.orderId = razorpay_order_id;
    payment.paymentId = razorpay_payment_id;
    payment.amount = req.body.amount; // Convert amount to actual value
    payment.currency = req.body.currency;
    payment.subscription_startDate = new Date();
    payment.subscription_expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    payment.status = 'Payment Done';

    await payment.save();

    res.status(200).json({ success: true, message: 'Payment record updated successfully', payment });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.updatePaymentRecord = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, salon_id, phoneNumber, amount, currency } = req.body;

  
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Invalid signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Use either salon_id or phoneNumber to find the payment record
    const paymentRecord = await Payment.findOneAndUpdate(
      { $or: [{ salon_id }, { phoneNumber }] },
      {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount,
        currency,
        subscription_startDate: new Date(),
        subscription_expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'Payment Done',
      },
      { new: true }
    );

    if (!paymentRecord) {
      console.error('Payment record not found');
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // console.log('Payment record updated successfully:', paymentRecord);

    res.status(200).json({ success: true, message: 'Payment record updated successfully', paymentRecord });
  } catch (error) {
    console.error('Error updating payment record:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment record' });
  }
};

// Controller to get payment status by phone number
exports.getPaymentStatus = async (req, res) => {
  const { phoneNumber } = req.query;

  try {
    const paymentRecord = await Payment.findOne({ phoneNumber });

    if (paymentRecord) {
      return res.status(200).json({ status: paymentRecord.status });
    } else {
      return res.status(404).json({ message: "Payment record not found" });
    }
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getSubscriptionsBySalonId = async (req, res) => {
  const { salon_id } = req.query;

  try {
    const subscriptions = await Payment.find({ salon_id });
    if (subscriptions) {
      res.status(200).json(subscriptions);
    } else {
      res.status(404).json({ message: "Subscription details not found for this salon" });
    }
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    res.status(500).json({ message: "Error fetching subscription details" });
  }
};
