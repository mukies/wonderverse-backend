const tourModel = require("../models/tour.m");
const slugify = require("slugify");
const categoryModel = require("../models/state.m");
const guideModel = require("../models/guide.m");
const hotelModel = require("../models/hotel.m");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const stateModel = require("../models/state.m");
const activityModel = require("../models/activity.m");
const { validationResult } = require("express-validator");
const transportationModel = require("../models/transportation.m");

exports.createTour = async (req, res) => {
  const {
    placeName, //todo string
    state,
    activity,
    description, //not required
    location,
  } = req.body;
  const { featureImages, mainImage } = req.body;
  try {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: result.array(),
      });

    const isNameExist = await tourModel.findOne({
      $or: [
        {
          slug: slugify(placeName.toLowerCase(), "+"),
        },
        {
          placeName,
        },
      ],
    });

    if (isNameExist)
      return res
        .status(403)
        .json({ success: false, message: "Tour name already exist." });

    if (!mainImage.startsWith("http")) {
      mainImage = await generateLink(mainImage);
    }

    featureImages = featureImages.map(async (img) => {
      if (!img.startsWith("http")) {
        return await generateLink(img);
      }
      return img;
    });

    const newTour = new tourModel({
      placeName,
      slug: slugify(placeName.toLowerCase(), "+"),
      mainImage,
      state,
      activity,
      description,
      location,
      featureImages,
    });
    await newTour.save();
    res.status(201).json({ success: true, message: "tour created", newTour });
  } catch (error) {
    console.log("Error while creating the tour.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating tour." });
  }
};

exports.allTours = async (req, res) => {
  const { page } = req.query;
  try {
    const tours = await tourModel.find().populate("state").populate("activity");

    res.status(200).json({ success: true, tours });
  } catch (error) {
    console.log("Error while fetching all tour");
    res
      .status(500)
      .json({ success: false, message: "Error while fetching all tour." });
  }
};

exports.getToursByState = async (req, res) => {
  const { slug } = req.params;
  const { page } = req.query;
  try {
    const state = await stateModel.findOne({ slug });

    if (!state)
      return res
        .status(403)
        .json({ success: false, message: "State not found." });

    const tours = await tourModel
      .find({ state: state._id })
      .populate("state")
      .populate("activity");
    res.status(200).json({ success: true, tours });
  } catch (error) {
    console.log("Error while fetching tours data.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching tours data." });
  }
};
exports.getToursByActivity = async (req, res) => {
  const { slug } = req.params;
  const { page } = req.query;
  try {
    const activity = await activityModel.findOne({ slug });

    if (!activity)
      return res
        .status(403)
        .json({ success: false, message: "Activity not found." });

    const tours = await tourModel
      .find({ activity: activity._id })
      .populate("state")
      .populate("activity");
    res.status(200).json({ success: true, tours });
  } catch (error) {
    console.log("Error while fetching tours data.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching tours data." });
  }
};

exports.singleTour = async (req, res) => {
  try {
    const { tourID } = req.params;

    const availableGuides = await guideModel.find({ tourID });
    const availableHotels = await hotelModel.find({ tourID });
    // const availableTransportations = await transportationModel.find({ tourID });

    const tour = await tourModel
      .findById(tourID)
      .populate("state")
      .populate("activity")
      .populate("reviews.userID", "firstName lastName");

    const tourDetails = {
      tour,
      availableGuides,
      availableHotels,
      availableTransportations,
    };
    res.status(200).json({ success: true, tourDetails });
  } catch (error) {
    console.log("Error while getting tour details.");
    res
      .status(500)
      .json({ message: "Error while getting tour details.", success: false });
  }
};

exports.editTour = async (req, res) => {
  const { placeName, state, activity, description, location } = req.body;
  let { featureImages, mainImage } = req.body;

  const { tourID } = req.params;

  try {
    //TODO: Validation check for all fields
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: result.array(),
      });

    const isNameExist = await tourModel.findOne({
      slug: slugify(placeName.toLowerCase(), "+"),
    });

    if (isNameExist)
      return res
        .status(403)
        .json({ success: false, message: "Tour name already exist." });

    //use cloudinary
    featureImages = featureImages.map(async (item) => {
      if (!item.startsWith("http")) {
        return await generateLink(item);
      }
      return item;
    });

    //convert main image links into cloudinary links
    if (!mainImage.startsWith("http")) {
      mainImage = await generateLink(mainImage);
    }

    const tourUpdate = await tourModel.findByIdAndUpdate(tourID, {
      placeName,
      slug: slugify(placeName.toLowerCase(), "+"),
      mainImage,
      state,
      activity,
      description,
      location,
      featureImages,
    });
    await tourUpdate.save();
    res
      .status(200)
      .json({ success: true, message: "Tour has been updated", tourUpdate });
  } catch (error) {
    console.log("Error while creating the tour.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating tour." });
  }
};

exports.deleteTour = async (req, res) => {
  const { tourID } = req.params;

  if (!req.admin)
    return res.status(401).json({
      success: false,
      message: "Deletation failed. Unauthorize permission.",
    });

  try {
    await tourModel.findByIdAndDelete(tourID);
    res
      .status(200)
      .json({ success: true, message: "Tour deleted successfully." });
  } catch (error) {
    console.log("Error while deleting tour");
    res
      .status(500)
      .json({ success: false, message: "Error while deleting tour." });
  }
};

exports.featuredTrips = async (req, res) => {
  try {
    const trips = await tourModel
      .find()
      .sort({ avgRating: -1 })
      .limit(8)
      .populate("state")
      .populate("activity");

    res.status(200).json({ success: true, trips });
  } catch (error) {
    console.log("Error while fetching featured trip");
    res
      .status(500)
      .json({ success: false, message: "Error while fetching featured trip." });
  }
};
