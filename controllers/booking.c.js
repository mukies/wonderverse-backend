const bookingModel = require("../models/booking.m");
const userModel = require("../models/user.m");

exports.newBooking = async (req, res) => {
  const { id: tourID } = req.params;
  const userID = req.user?._id;

  const {
    selectedGuide,
    selectedHotel,
    selectedTransportation,
    tourStartingDate,
    participants,
    totalTourCost,
  } = req.body;

  try {
    //todo:vaidations

    const newBooking = new bookingModel({
      userID,
      tourID,
      bookingDate: new Date(),
      participants,
      selectedGuide,
      tourStartingDate,
      selectedHotel,
      selectedTransportation,
      totalTourCost,
    });

    const user = await userModel.findById(userID);

    await newBooking.save();
    //todo:send booking confirmation email

    res.status(200).json({
      success: true,
      message: "Tour booked successfully.",
      newBooking,
    });
  } catch (error) {
    console.log("error while booking tour.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while booking tour." });
  }
};
