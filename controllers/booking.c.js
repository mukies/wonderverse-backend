const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const bookingModel = require("../models/booking.m");
const { initializeEsewa } = require("../payments/esewa_payment");
const { validationResult } = require("express-validator");
const { get, set } = require("../config/cache_setup");
const { clearCacheByPrefix } = require("../helper/clearCache");

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
  if (!tourID)
    return res
      .status(400)
      .json({ success: false, message: "Tour id is required" });

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  if (!mongoose.Types.ObjectId.isValid(tourID)) return invalidObj(res);

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
    url = await initializeEsewa(totalTourCost, newBooking._id, res, "tour");
  }

  if (!url)
    return res
      .status(401)
      .json({ success: false, message: "Invalid payment method" });

  await clearCacheByPrefix("allBookings");
  await clearCacheByPrefix("allUserBookings");

  res.status(200).json({
    success: true,
    data: url,
  });
});

exports.allBookings = tryCatchWrapper(async (req, res) => {
  let bookings = await get("allBookings");

  if (bookings) return res.json({ success: true, data: bookings });

  bookings = await bookingModel
    .find()
    .populate("userID", "firstName lastName gender photo")
    .populate("tourID")
    .populate("selectedGuide")
    .populate("selectedTransportation.transportationID")
    .populate("selectedHotel.hotelID", "hotelDetails")
    .sort({ createdAt: -1 });

  await set("allBookings", bookings, 3600);
  res.json({ success: true, data: bookings });
});

exports.allUsersBookings = tryCatchWrapper(async (req, res) => {
  let bookings = await get("allUserBookings");

  if (bookings) return res.json({ success: true, data: bookings });

  bookings = await bookingModel
    .find({ userID: req.user })
    .populate("userID", "firstName lastName gender photo")
    .populate("tourID")
    .populate("selectedGuide")
    .populate("selectedTransportation.transportationID")
    .populate("selectedHotel.hotelID")
    .sort({ createdAt: -1 });

  await set("allUserBookings", bookings, 3600);
  res.json({ success: true, data: bookings });
});
