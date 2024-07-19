const mongoose = require("mongoose");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const guideRegistrationModel = require("../models/guideRegistration.m");
const tourModel = require("../models/tour.m");
const { validationResult } = require("express-validator");

exports.addGuide = async (req, res) => {
  const { contactNumber, guidingDestinations, guideName, guideEmail, gender } =
    req.body;
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
    });

    await newGuide.save();

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
  const { contactNumber, guidingDestinations, guideName, guideEmail, gender } =
    req.body;
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
      },
      { new: true }
    );

    if (!updatedGuide)
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });

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

// exports.fetchGuideByTourId = async (req, res) => {
//   const { tourID } = req.params;
//   try {
//     const guides = await guideRegistrationModel
//       .find({
//         guidingDestinations: tourID,
//         status: "approved",
//       })
//       .populate("requestedBy", "photo firstName lastName email");

//     res.status(200).json({ success: true, guides });
//   } catch (error) {
//     console.log("Error while fetching guide.", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error while fetching guide." });
//   }
// };

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
      .populate("guidingDestinations", "placeName mainImage slug location");

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

    const guide = await guideRegistrationModel.findById(guideID);
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
