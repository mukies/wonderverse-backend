const paymentModel = require("../models/payment.m");

exports.newPayment = async (
  booking,
  user,
  amount,
  transaction_code,
  currency,
  status,
  paymentMethod,
  tourType,
  res
) => {
  try {
    const isExist = await paymentModel.findOne({ transaction_code });

    if (isExist) return;

    const newPay = new paymentModel({
      amount,
      booking,
      currency,
      paymentMethod,
      user,
      status,
      transaction_code,
      tourType,
    });

    await newPay.save();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
