const { default: mongoose } = require("mongoose");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const sponsorModel = require("../models/sponsor.m");
const { invalidObj } = require("../helper/objectIdHendler");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { validationResult } = require("express-validator");
const { clearCacheByPrefix } = require("../helper/clearCache");
const { get, set } = require("../config/cache_setup");

exports.addSponsor = async (req, res) => {
  const { sponsorName } = req.body;
  let { sponsorImage } = req.body;

  if (!sponsorName || !sponsorImage)
    return res
      .status(400)
      .json({ success: false, message: "Sponsor name and image required." });
  try {
    if (!sponsorImage.startsWith("http")) {
      sponsorImage = await generateLink(sponsorImage);
    }

    const newSponsor = new sponsorModel({
      sponsorImage,
      sponsorName,
    });

    await newSponsor.save();
    await clearCacheByPrefix("sponsor");

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

exports.getAllSponsor = tryCatchWrapper(async (req, res) => {
  let sponsor = await get("sponsorAll");
  if (sponsor) return res.json({ success: true, data: sponsor });

  sponsor = await sponsorModel.find();

  await set("sponsorAll", sponsor, 3600);
  res.json({
    success: true,
    data: sponsor,
  });
});

exports.singleSponsor = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  let sponsor = await get(`sponsor${id}`);
  if (sponsor) return res.json({ success: true, data: sponsor });

  sponsor = await sponsorModel.findById(id);

  await set(`sponsor${id}`, sponsor, 3600);
  res.json({
    success: true,
    data: sponsor,
  });
});

exports.getAllActiveSponsor = tryCatchWrapper(async (req, res) => {
  let sponsor = await get("sponsorActive");

  if (sponsor) return res.json({ success: true, data: sponsor });

  sponsor = await sponsorModel.find({ status: "active" });

  await set("sponsorActive", sponsor, 3600);

  res.json({
    success: true,
    data: sponsor,
  });
});

exports.editSponsor = async (req, res) => {
  const { sponsorName } = req.body;
  let { sponsorImage } = req.body;
  const { id } = req.params;

  if (!sponsorName || !sponsorImage)
    return res
      .status(400)
      .json({ success: false, message: "Sponsor name and image required." });

  try {
    if (!sponsorImage.startsWith("http")) {
      sponsorImage = await generateLink(sponsorImage);
    }

    const updatedSponsor = await sponsorModel.findByIdAndUpdate(
      id,
      {
        sponsorImage,
        sponsorName,
      },
      { new: true }
    );
    await clearCacheByPrefix("sponsor");

    res.json({
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

exports.deleteSponsor = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const data = await sponsorModel.findById(id);

  if (!data)
    return res
      .status(404)
      .json({ success: false, message: "Sponsor not found" });

  await sponsorModel.findByIdAndDelete(id);
  await clearCacheByPrefix("sponsor");
  res.json({
    success: true,
    message: "Sponsor has been deleted.",
  });
});

exports.sponsorMultiDelete = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const data = await sponsorModel.findById(id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Sponsor not found" });
    await sponsorModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("sponsor");
  res.json({ success: true, message: "Data deleted successfully." });
});

exports.sponsorToggleStatus = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const data = await sponsorModel.findById(id);

  if (!data)
    return res
      .status(404)
      .json({ success: false, message: "Sponsor not found" });

  if (data.status == "active") {
    data.status = "inactive";
  } else {
    data.status = "active";
  }
  await clearCacheByPrefix("sponsor");
  await data.save();
  res.json({ success: true, message: "Sponsor status changed" });
});
