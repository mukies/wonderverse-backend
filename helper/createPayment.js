const paymentModel = require("../models/payment.m");

exports.newPayment = async (
  booking,
  user,
  amount,
  transaction_code,
  currency,
  status,
  paymentMethod,
  res
) => {
  try {
    const newPay = new paymentModel({
      amount,
      booking,
      currency,
      paymentMethod,
      user,
      status,
      transaction_code,
    });

    await newPay.save();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
