const { newPayment } = require("../helper/createPayment");
const bookingModel = require("../models/booking.m");
const { verifyEsewaPayment } = require("../config/esewa");
const packageBookingModel = require("../models/packageBooking.m");

const router = require("express").Router();

router.get("/complete-payment", async (req, res) => {
  const { data } = req.query;

  try {
    // Verify payment with eSewa
    const { response, decodedData } = await verifyEsewaPayment(data);

    const booking = await bookingModel.findById(response.transaction_uuid);
    const packageBooking = await packageBookingModel.findById(
      response.transaction_uuid
    );

    if (!booking && !packageBooking)
      return res
        .status(404)
        .json({ success: false, message: "Unable to find the booking." });

    if (
      response.status !== "COMPLETE" ||
      response.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.total_amount).toFixed(0) !==
        Number(decodedData.total_amount.replace(/,/g, "")).toFixed(0)
    ) {
      if (booking) {
        await bookingModel.findByIdAndUpdate(response.transaction_uuid, {
          status: "failed",
          paymentStatus: "failed",
        });
      } else {
        await packageBookingModel.findByIdAndUpdate(response.transaction_uuid, {
          status: "failed",
          paymentStatus: "failed",
        });
      }

      return res.status(402).json({
        success: false,
        message: "Booking failed.",
        isConfirmed: false,
      });
    }

    if (booking) {
      booking.status = "confirmed";
      booking.paymentStatus = "paid";
      await booking.save();
    } else {
      packageBooking.status = "confirmed";
      packageBooking.paymentStatus = "paid";
      await packageBooking.save();
    }

    // Create a new payment record in the database

    newPayment(
      booking ? booking._id : packageBooking._id,
      booking ? booking.userID : packageBooking.userID,
      response.total_amount,
      decodedData.transaction_code,
      "npr",
      "succeeded",
      "esewa",
      booking ? "Booking" : "PackageBooking",
      res
    );

    if (booking) {
      await bookingModel.deleteMany({
        userID: booking.userID,
        status: "pending",
        paymentStatus: "pending",
      });
    } else {
      await packageBookingModel.deleteMany({
        userID: packageBooking.userID,
        status: "pending",
        paymentStatus: "pending",
      });
    }
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

router.get("/complete-package-payment", async (req, res) => {
  const { data } = req.query;

  try {
    // Verify payment with eSewa
    const { response, decodedData } = await verifyEsewaPayment(data);

    const booking = await packageBookingModel.findById(
      response.transaction_uuid
    );

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Unable to find the booking." });

    if (
      response.status !== "COMPLETE" ||
      response.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.total_amount).toFixed(0) !==
        Number(decodedData.total_amount.replace(/,/g, "")).toFixed(0)
    ) {
      await packageBookingModel.findByIdAndUpdate(response.transaction_uuid, {
        status: "failed",
        paymentStatus: "failed",
      });

      return res.status(402).json({
        success: false,
        message: "Booking failed.",
        isConfirmed: false,
      });
    }

    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    await booking.save();

    // Create a new payment record in the database

    newPayment(
      booking._id,
      booking.userID,
      response.total_amount,
      decodedData.transaction_code,
      "npr",
      "succeeded",
      "esewa",
      "PackageBooking",
      res
    );

    await bookingModel.deleteMany({
      userID: booking.userID,
      status: "pending",
      paymentStatus: "pending",
    });

    // Respond with success message
    res.json({
      success: true,
      message: "Package Booking successful.",
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
