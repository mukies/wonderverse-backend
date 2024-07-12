const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const guideRegistrationModel = require("../models/guideRegistration.m");

exports.addGuide = async (req, res) => {
  const { contactNumber, guidingDestinations } = req.body;
  let { citizenshipPhoto, nationalIdPhoto } = req.body;

  //todo validation

  try {
    if (nationalIdPhoto && !nationalIdPhoto.startsWith("http")) {
      //todo generate cloudinary link

      nationalIdPhoto = await generateLink(nationalIdPhoto);
    }

    if (!citizenshipPhoto.startsWith("http")) {
      //todo generate cloudinary link

      citizenshipPhoto = await generateLink(citizenshipPhoto);
    }
    const newGuide = new guideRegistrationModel({
      citizenshipPhoto,
      nationalIdPhoto,
      contactNumber,
      requestedBy: req.partner,
      guidingDestinations,
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
  const { contactNumber, guidingDestinations } = req.body;
  let { citizenshipPhoto, nationalIdPhoto } = req.body;
  const { id } = req.params;
  //todo validation

  try {
    if (nationalIdPhoto && !nationalIdPhoto.startsWith("http")) {
      //todo generate cloudinary link

      nationalIdPhoto = await generateLink(nationalIdPhoto);
    }

    if (!citizenshipPhoto.startsWith("http")) {
      //todo generate cloudinary link

      citizenshipPhoto = await generateLink(citizenshipPhoto);
    }

    const updatedGuide = await guideRegistrationModel.findByIdAndUpdate(
      id,
      {
        citizenshipPhoto,
        nationalIdPhoto,
        contactNumber,
        status: "pending",
        guidingDestinations,
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

exports.fetchGuideByTourId = async (req, res) => {
  const { tourID } = req.params;
  try {
    const guides = await guideRegistrationModel
      .find({
        guidingDestinations: tourID,
      })
      .populate("requestedBy", "photo firstName lastName email");

    res.status(200).json({ success: true, guides });
  } catch (error) {
    console.log("Error while fetching guide.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching guide." });
  }
};

exports.deleteGuide = async (req, res) => {
  const { id } = req.params;
  try {
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

//admin action
exports.fetchAllGuide = async (req, res) => {
  try {
    const guides = await guideRegistrationModel.find({ status: "approved" });

    res.status(200).json({ success: true, guides });
  } catch (error) {
    console.log("Error while fetching all guide.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching all guide." });
  }
};
