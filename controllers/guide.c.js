const mongoose = require("mongoose");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const guideRegistrationModel = require("../models/guideRegistration.m");
const tourModel = require("../models/tour.m");
const { validationResult } = require("express-validator");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { paginate } = require("../helper/pagination");
const { set, get } = require("../config/cache_setup");
const { clearCacheByPrefix } = require("../helper/clearCache");
const { invalidObj } = require("../helper/objectIdHendler");

exports.addGuide = async (req, res) => {
  const {
    contactNumber,
    guidingDestinations,
    guideName,
    guideEmail,
    gender,
    price,
  } = req.body;
  let { citizenshipPhoto, guidePhoto, nationalIdPhoto } = req.body;

  //todo validation

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  try {
    if (nationalIdPhoto && !nationalIdPhoto.startsWith("http")) {
      //todo generate cloudinary link

      nationalIdPhoto = await generateLink(nationalIdPhoto);
    }
    if (!guidePhoto.startsWith("http")) {
      //todo generate cloudinary link

      guidePhoto = await generateLink(guidePhoto);
    }

    citizenshipPhoto = await Promise.all(
      citizenshipPhoto.map(async (photo) => {
        if (!photo.startsWith("http")) {
          //todo generate cloudinary link

          return await generateLink(photo);
        }
        return photo;
      })
    );

    const newGuide = new guideRegistrationModel({
      citizenshipPhoto,
      nationalIdPhoto,
      contactNumber,
      requestedBy: req.partner,
      guidingDestinations,
      guidePhoto,
      guideName,
      guideEmail,
      gender,
      price,
    });

    await newGuide.save();
    await clearCacheByPrefix("guideRequests");
    await clearCacheByPrefix("total");

    res.status(201).json({
      success: true,
      message: "New guide has been created.",
      newGuide,
    });
  } catch (error) {
    console.log("Error while adding guide.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while adding guide." });
  }
};

exports.editGuideDetails = async (req, res) => {
  const {
    contactNumber,
    guidingDestinations,
    guideName,
    guideEmail,
    gender,
    price,
  } = req.body;
  let { citizenshipPhoto, guidePhoto, nationalIdPhoto } = req.body;
  const { id } = req.params;
  const result = validationResult(req);

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(401)
      .json({ success: false, message: "Invalid object id" });

  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  try {
    if (nationalIdPhoto && !nationalIdPhoto.startsWith("http")) {
      //todo generate cloudinary link

      nationalIdPhoto = await generateLink(nationalIdPhoto);
    }

    if (!guidePhoto.startsWith("http")) {
      //todo generate cloudinary link

      guidePhoto = await generateLink(guidePhoto);
    }

    citizenshipPhoto = await Promise.all(
      citizenshipPhoto.map(async (photo) => {
        if (!photo.startsWith("http")) {
          //todo generate cloudinary link

          return await generateLink(photo);
        }
        return photo;
      })
    );

    const updatedGuide = await guideRegistrationModel.findByIdAndUpdate(
      id,
      {
        citizenshipPhoto,
        nationalIdPhoto,
        contactNumber,
        status: "pending",
        guidingDestinations,
        guidePhoto,
        guideName,
        guideEmail,
        gender,
        price,
      },
      { new: true }
    );

    if (!updatedGuide)
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });

    await clearCacheByPrefix("guideRequests");
    await clearCacheByPrefix("total");

    res.status(200).json({
      success: true,
      message: "Guide details has been updated.",
      updatedGuide,
    });
  } catch (error) {
    console.log("Error while updating guide details.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating guide details." });
  }
};

exports.deleteGuide = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const guide = await guideRegistrationModel.findById(id);
    if (!guide)
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });

    await guideRegistrationModel.findByIdAndDelete(id);
    await clearCacheByPrefix("guideRequests");
    await clearCacheByPrefix("total");

    res
      .status(200)
      .json({ success: true, message: "Guide deleted successfully." });
  } catch (error) {
    console.log("Error while deleting guide.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting guide." });
  }
};

exports.fetch_all_guiding_destinations_tours = async (req, res) => {
  const { guideID } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(guideID))
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const guide = await guideRegistrationModel.findById(guideID);
    if (!guide)
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });

    const tours = await tourModel.find({ _id: guide.guidingDestinations });

    res.json({ success: true, tours });
  } catch (error) {
    console.log("Error while fetching guiding destination tours", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching guiding destination tours",
    });
  }
};

exports.fetchAllGuide = async (req, res) => {
  try {
    const guides = await guideRegistrationModel
      .find({ requestedBy: req.partner })
      .populate(
        "guidingDestinations",
        "placeName mainImage slug location avgRating"
      );

    res.status(200).json({ success: true, guides });
  } catch (error) {
    console.log("Error while fetching all guide.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching all guide." });
  }
};
exports.singleGuideData = async (req, res) => {
  const { guideID } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(guideID))
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const guide = await guideRegistrationModel
      .findById(guideID)
      .populate(
        "guidingDestinations",
        "placeName mainImage slug location avgRating"
      );
    if (!guide)
      return res
        .status(404)
        .json({ success: true, message: "Guide not found" });

    res.json({ success: true, guide });
  } catch (error) {
    console.log("Error while fetching guide data", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching guide data" });
  }
};

//admin
exports.allApprovedGuide = tryCatchWrapper(async (req, res) => {
  const { limit, page, skip } = paginate(req);

  let guides = await get(`registeredGuide:${page}`);

  if (guides) return res.json({ success: true, data: guides });

  guides = await guideRegistrationModel
    .find({ status: "approved" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("requestedBy", "photo firstName lastName gender email")
    .populate("guidingDestinations", "placeName mainImage");

  const totalItems = await guideRegistrationModel.countDocuments({
    status: "approved",
  });
  const totalPages = Math.ceil(totalItems / limit);

  const data = {
    guides,
    totalItems,
    totalPages,
    page,
  };

  await set(`registeredGuide:${page}`, data, 3600);
  res.json({ success: true, data });
});

exports.toggleGuideAvailability = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const result = validationResult(req);

  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const guide = await guideRegistrationModel.findOne({
    _id: id,
    status: "approved",
  });
  if (!guide)
    return res.status(404).json({ success: false, message: "Guide not found" });

  if (req.partner) {
    if (guide.requestedBy.toString() !== req.partner)
      return res
        .status(401)
        .json({ success: false, message: "You didn't created this guide." });
  }

  guide.isAvailable = !guide.isAvailable;
  await guide.save();
  await clearCacheByPrefix("registeredGuide");

  res.json({ success: true, message: "Guide availability changed" });
});
