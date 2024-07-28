const { validationResult } = require("express-validator");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const packageModel = require("../models/tourPackage.m");
const { get, set } = require("../config/cache_setup");
const mongoose = require("mongoose");
const tourModel = require("../models/tour.m");
const { clearCacheByPrefix } = require("../helper/clearCache");

exports.addPackage = tryCatchWrapper(async (req, res) => {
  const {
    placeName,
    location,
    state,
    activity,
    description,
    included,
    places,
    discountPercent,
    price,
  } = req.body;
  let { featureImages, mainImage } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({
      success: false,
      message: result.array()[0].msg,
    });

  const isNameExist = await packageModel.findOne({
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
      .json({ success: false, message: "Package name already exist." });

  if (!mainImage.startsWith("http")) {
    mainImage = await generateLink(mainImage);
  }

  featureImages = await Promise.all(
    featureImages.map(async (img) => {
      if (!img.startsWith("http")) {
        return await generateLink(img);
      }
      return img;
    })
  );

  let newPackage = new packageModel({
    placeName,
    slug: slugify(placeName.toLowerCase(), "+"),
    mainImage,
    state,
    activity,
    description,
    location: location.toLowerCase(),
    featureImages,
    included,
    places,
    discountPercent,
    price,
  });

  await newPackage.save();

  await clearCacheByPrefix("package");

  res.json({ success: true, data: newPackage });
});

exports.updatePackage = tryCatchWrapper(async (req, res) => {
  const {
    placeName,
    location,
    state,
    activity,
    description,
    included,
    places,
    discountPercent,
    price,
  } = req.body;
  let { featureImages, mainImage } = req.body;
  const { packageID } = req.params;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({
      success: false,
      message: result.array()[0].msg,
    });

  if (!mongoose.Types.ObjectId.isValid())
    return res
      .status(401)
      .json({ success: false, message: "Invalid package id" });

  const isNameExist = await packageModel.findOne({
    placeName,
    _id: { $ne: packageID },
  });

  if (isNameExist)
    return res
      .status(403)
      .json({ success: false, message: "Package name already exist." });

  if (!mainImage.startsWith("http")) {
    mainImage = await generateLink(mainImage);
  }

  featureImages = await Promise.all(
    featureImages.map(async (img) => {
      if (!img.startsWith("http")) {
        return await generateLink(img);
      }
      return img;
    })
  );

  let updatedPackage = await packageModel.findByIdAndUpdate(
    packageID,
    {
      placeName,
      slug: slugify(placeName.toLowerCase(), "+"),
      mainImage,
      state,
      activity,
      description,
      location: location.toLowerCase(),
      featureImages,
      included,
      places,
      discountPercent,
      price,
    },
    { new: true }
  );

  await clearCacheByPrefix("package");

  res.json({ success: true, data: updatedPackage });
});

exports.getSinglePackage = tryCatchWrapper(async (req, res) => {
  const { slug } = req.params;

  let packageDetails = await get(`package:${slug}`);

  if (packageDetails) return res.json({ success: true, packageDetails });

  const package = await packageModel
    .findOne({ slug })
    .populate("activity")
    .populate("places");

  if (!package)
    return res
      .status(404)
      .json({ success: false, message: "Package not found" });

  const suggestedTour = await tourModel
    .find({ activity: package.activity._id })
    .select("placeName slug")
    .limit(5);
  const suggestedPackage = await packageModel
    .find({ activity: tour.activity._id, _id: { $ne: package._id } })
    .select("placeName slug")
    .limit(5);

  packageDetails = {
    tour,
    guides,
    hotels,
    suggestedTour,
    suggestedPackage,
  };
});
