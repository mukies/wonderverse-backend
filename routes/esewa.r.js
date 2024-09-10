const { default: mongoose } = require("mongoose");
const { newPayment } = require("../helper/createPayment");
const bookingModel = require("../models/booking.m");
const { verifyEsewaPayment } = require("../config/esewa");

const router = require("express").Router();

router.get("/complete-payment", async (req, res) => {
  const { data } = req.query;

  try {
    // Verify payment with eSewa
    const { response, decodedData } = await verifyEsewaPayment(data);

    const booking = await bookingModel.findById(response.transaction_uuid);

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Unable to find the booking." });

    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.data.total_amount).toFixed(0) !==
        Number(decodedData.total_amount.replace(/,/g, "")).toFixed(0)
    ) {
      await bookingModel.findByIdAndUpdate(response.transaction_uuid, {
        status: "failed",
        paymentStatus: "failed",
      });

      return res.status(402).json({
        success: false,
        message: "Booking failed.",
        isConfirmed: false,
      });
    }

    bookingModel.deleteMany({
      userID: mongoose.Types.ObjectId(booking.userID),
      status: "pending",
      paymentStatus: "pending",
    });

    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    await booking.save();

    // Create a new payment record in the database

    newPayment(
      booking._id,
      booking.userID,
      response.data.total_amount,
      decodedData.transaction_code,
      "npr",
      "succeeded",
      "esewa",
      res
    );

    //send emails

    // Respond with success message
    res.json({
      success: true,
      message: "Booking successful.",
      isConfirmed: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
