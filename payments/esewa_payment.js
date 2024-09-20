const { getEsewaPaymentHash } = require("../config/esewa");

exports.initializeEsewa = async (amount, bookingID, res, title) => {
  try {
    const transaction_uuid = bookingID;
    const totalAmount = parseFloat(amount).toFixed(2);
    const { signature, signed_field_names } = await getEsewaPaymentHash(
      totalAmount,
      transaction_uuid
    );

    const failureUrl = `${process.env.FRONTEND_URL}/booking/failed`;
    const successUrl = `${process.env.FRONTEND_URL}/booking/success`;

    const payload = {
      amount: totalAmount,
      failure_url: failureUrl,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: process.env.ESEWA_MERCHANT_CODE,
      signature,
      signed_field_names,
      success_url: successUrl,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid,
    };

    const paymentUrl = `${process.env.ESEWA_GATEWAY_URL}?${new URLSearchParams(
      payload
    ).toString()}`;

    return paymentUrl;
  } catch (error) {
    console.log("error while esewa payment", error);
    res.status(500).json({ success: false, message: "Error while payment." });
  }
};
