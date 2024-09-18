const { validationResult } = require("express-validator");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const packageBookingModel = require("../models/packageBooking.m");
const { initializeEsewa } = require("../payments/esewa_payment");
const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");

exports.newPackageBooking = tryCatchWrapper(async (req, res) => {
  const {
    userDetails,

    selectedPlaces,
    numberOfPeople,
    startingDate,
    totalPackageCost,
  } = req.body;

  const { via } = req.query;
  const { packageID } = req.params;

  if (!packageID)
    return res
      .status(400)
      .json({ success: false, message: "Package id is required" });

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(404)
      .json({ success: false, message: result.array()[0].msg });

  if (!mongoose.Types.ObjectId.isValid(packageID)) return invalidObj(res);

  const existedBooking = await packageBookingModel.findOne({
    userID: req.user,
    packageID,
    paymentStatus: "pending",
  });

  if (existedBooking) {
    await packageBookingModel.findByIdAndDelete(existedBooking._id);
  }

  const newBooking = new packageBookingModel({
    bookingDate: new Date(),
    userDetails,
    userID: req.user,
    packageID,
    selectedPlaces,
    totalPackageCost,
    numberOfPeople,
    startingDate,
  });
  await newBooking.save();

  let url;
  if (via == "esewa") {
    url = await initializeEsewa(
      totalPackageCost,
      newBooking._id,
      res,
      "package"
    );
  }

  if (!url)
    return res
      .status(401)
      .json({ success: false, message: "Invalid payment method" });

  res.json({ success: true, data: url });
});
