const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const guideModel = require("../models/guide.m");

exports.addGuide = async (req, res) => {
  const { tourID, guideName, price, guideDesc, guideContactNumber } = req.body;
  let { guidePhoto } = req.body;

  //todo validation
  try {
    if (!guidePhoto.startsWith("http")) {
      //todo generate cloudinary link

      guidePhoto = await generateLink(guidePhoto);
    }

    const newGuide = new guideModel({
      tourID,
      guideName,
      price,
      guideDesc: guideDesc || "",
      guideContactNumber,
      guidePhoto,
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
  const { tourID, guideName, price, guideDesc, guideContactNumber } = req.body;
  let { guidePhoto } = req.body;
  const { id } = req.params;

  //todo validation
  try {
    if (!guidePhoto.startsWith("http")) {
      guidePhoto = await generateLink(guidePhoto);
    }

    const updatedGuide = await guideModel.findByIdAndUpdate(id, {
      tourID,
      guideName,
      price,
      guideDesc: guideDesc || "",
      guideContactNumber,
      guidePhoto,
    });

    await updatedGuide.save();

    res.status(201).json({
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

exports.fetchAllGuide = async (req, res) => {
  try {
    const guides = await guideModel.find();

    res.status(200).json({ success: true, guides });
  } catch (error) {
    console.log("Error while fetching guide.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching guide." });
  }
};
exports.fetchGuideByTourId = async (req, res) => {
  const { tourID } = req.params;
  try {
    const guides = await guideModel.find({ tourID });

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
    await guideModel.findByIdAndDelete(id);

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
