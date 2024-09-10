const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const bookingModel = require("../models/booking.m");
const userModel = require("../models/user.m");
const { initializeEsewa } = require("../payments/esewa_payment");
const { validationResult } = require("express-validator");

exports.newTourBooking = tryCatchWrapper(async (req, res) => {
  const { tourID } = req.params;
  const { via } = req.query;
  const userID = req.user;

  const {
    selectedGuide,
    selectedHotel,
    selectedTransportation,
    userDetails,
    totalTourCost,
  } = req.body;

  //todo:vaidations

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const existedBooking = await bookingModel.findOne({
    userID,
    tourID,
    paymentStatus: "pending",
  });

  if (existedBooking) {
    await bookingModel.findByIdAndDelete(existedBooking._id);
  }

  const newBooking = new bookingModel({
    userID,
    tourID,
    bookingDate: new Date(),
    selectedGuide,
    selectedHotel,
    selectedTransportation,
    totalTourCost,
    userDetails,
  });

  await newBooking.save();

  //todo: booking confirmation emails will send after verifying payment

  let url;
  if (via == "esewa") {
    url = await initializeEsewa(totalTourCost, newBooking._id, res);
  }

  if (!url)
    return res
      .status(401)
      .json({ success: false, message: "Invalid payment method" });

  res.status(200).json({
    success: true,
    data: url,
  });
});
