const bookingModel = require("../models/booking.m");
const userModel = require("../models/user.m");
const { initializeEsewa } = require("../payments/esewa_payment");
const { validationResult } = require("express-validator");

exports.newTourBooking = async (req, res) => {
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

  try {
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

    let bookingId;

    if (existedBooking) {
      existedBooking.bookingDate = new Date();
      existedBooking.selectedGuide = selectedGuide;
      existedBooking.selectedHotel = selectedHotel;
      existedBooking.selectedTransportation = selectedTransportation;
      existedBooking.userDetails = userDetails;
      existedBooking.totalTourCost = totalTourCost;

      await existedBooking.save();
      bookingId = existedBooking._id;
    } else {
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
      bookingId = newBooking._id;
    }

    //todo:send booking confirmation email

    let url;
    if (via == "esewa") {
      url = await initializeEsewa(totalTourCost, bookingId, res);
    }

    if (!url)
      return res
        .status(401)
        .json({ success: false, message: "Invalid payment method" });

    res.status(200).json({
      success: true,
      data: url,
    });
  } catch (error) {
    console.log("error while booking tour.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while booking tour." });
  }
};
