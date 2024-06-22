const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const sponsorModel = require("../models/sponsor.m");

exports.addSponsor = async (req, res) => {
  const { sponsorName, sponsorDescription } = req.body;
  let { sponsorImage } = req.body;

  if (!req.admin)
    return res.status(401).json({
      success: false,
      message: "Sponsor creation failed. Unauthorize permission.",
    });

  if (!sponsorName || !sponsorImage)
    return res
      .status(400)
      .json({ success: false, message: "Sponsor name and image required." });
  try {
    //todo:cloudinary

    if (!sponsorImage.startsWith("http")) {
      //todo:generate cloudinary image link and return

      sponsorImage = await generateLink(sponsorImage);
    }

    const newSponsor = new sponsorModel({
      sponsorDescription,
      sponsorImage,
      sponsorName,
    });
    res.status(201).json({
      success: true,
      message: "New sponsor has been added.",
      newSponsor,
    });
  } catch (error) {
    console.log("Error while creating sponsor");
    res
      .status(500)
      .json({ success: false, message: "Error while creating sponsor" });
  }
};

exports.getAllSponsor = async (req, res) => {
  try {
    const sponsors = await sponsorModel.find();
    res.status(200).json({
      success: true,
      message: "Sponsor found successfully.",
      sponsors,
    });
  } catch (error) {
    console.log("Error while fetching sponsor");
    res
      .status(500)
      .json({ success: false, message: "Error while fetching sponsor" });
  }
};

exports.editSponsor = async (req, res) => {
  const { sponsorName, sponsorDescription } = req.body;
  let { sponsorImage } = req.body;
  const { id } = req.params;

  if (!req.admin)
    return res.status(401).json({
      success: false,
      message:
        "Updating sponsor details process failed. Unauthorize permission.",
    });

  if (!sponsorName || !sponsorImage)
    return res
      .status(400)
      .json({ success: false, message: "Sponsor name and image required." });

  try {
    if (!sponsorImage.startsWith("http")) {
      sponsorImage = await generateLink(sponsorImage);
    }

    const updatedSponsor = await sponsorModel.findByIdAndUpdate(id, {
      sponsorDescription,
      sponsorImage,
      sponsorName,
    });

    res.status(200).json({
      success: true,
      message: "Sponsor details has been updated.",
      updatedSponsor,
    });
  } catch (error) {
    console.log("Error while updating sponsor details.");
    res.status(500).json({
      success: false,
      message: "Error while updating sponsor details.",
    });
  }
};

exports.deleteSponsor = async (req, res) => {
  const { id } = req.params;
  if (!req.admin)
    return res.status(401).json({
      success: false,
      message: "Sponsor deletation failed. Unauthorize permission.",
    });

  try {
    await sponsorModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Sponsor has been deleted.",
    });
  } catch (error) {
    console.log("Error while deleting sponsor.");
    res.status(500).json({
      success: false,
      message: "Error while deleting sponsor.",
    });
  }
};
