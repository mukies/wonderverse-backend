const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const hotelModel = require("../models/hotel.m");

exports.addHotel = async (req, res) => {
  const {
    tourID,
    hotelName,
    livingCostPerDayPerPerson,
    hotelDesc,
    hotelContactNumber,
    hotelLocation,
  } = req.body;
  let { hotelMainImage, featureImages } = req.body;

  //todo validation
  try {
    if (!hotelMainImage.startsWith("http")) {
      //todo generate cloudinary link

      hotelMainImage = await generateLink(hotelMainImage);
    }

    featureImages = featureImages.map(async (photo) => {
      if (!photo.startsWith("http")) {
        //todo generate cloudinary link

        return await generateLink(photo);
      }
      return photo;
    });

    const newHotel = new hotelModel({
      tourID,
      hotelName,
      livingCostPerDayPerPerson,
      hotelDesc: hotelDesc || "",
      hotelContactNumber,
      hotelLocation,
      hotelMainImage,
      featureImages,
    });

    await newHotel.save();

    res.status(201).json({
      success: true,
      message: "New hotel has been created.",
      newHotel,
    });
  } catch (error) {
    console.log("Error while adding hotel.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while adding hotel." });
  }
};

exports.editHotelDetails = async (req, res) => {
  const {
    tourID,
    hotelName,
    livingCostPerDayPerPerson,
    hotelDesc,
    hotelContactNumber,
    hotelLocation,
  } = req.body;
  let { hotelMainImage, featureImages } = req.body;

  const { id } = req.params;

  //todo validation
  try {
    if (!hotelMainImage.startsWith("http")) {
      hotelMainImage = await generateLink(hotelMainImage);
    }

    featureImages = featureImages.map(async (photo) => {
      if (!photo.startsWith("http")) {
        return await generateLink(photo);
      }
      return photo;
    });

    const updatedHotel = await hotelModel.findByIdAndUpdate(id, {
      tourID,
      hotelName,
      livingCostPerDayPerPerson,
      hotelDesc: hotelDesc || "",
      hotelContactNumber,
      hotelLocation,
      hotelMainImage,
      featureImages,
    });

    await updatedHotel.save();

    res.status(201).json({
      success: true,
      message: "Hotel details has been updated.",
      updatedHotel,
    });
  } catch (error) {
    console.log("Error while updating hotel details.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating hotel details." });
  }
};

exports.fetchAllHotel = async (req, res) => {
  try {
    const hotels = await hotelModel.find();

    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.log("Error while fetching hotels.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching hotels." });
  }
};
exports.fetchHotelByTourId = async (req, res) => {
  const { tourID } = req.params;
  try {
    const hotels = await hotelModel.find({ tourID });

    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.log("Error while fetching hotels.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching hotels." });
  }
};

exports.deleteHotel = async (req, res) => {
  const { id } = req.params;
  try {
    await hotelModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Hotel deleted successfully." });
  } catch (error) {
    console.log("Error while deleting hotel.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting hotel." });
  }
};
