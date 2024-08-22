const { validationResult } = require("express-validator");
const { invalidObj } = require("../helper/objectIdHendler");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const topDestinationModel = require("../models/top_destination.m");
const mongoose = require("mongoose");
const { get, set } = require("../config/cache_setup");
const { clearCacheByPrefix } = require("../helper/clearCache");

exports.add_in_top_destination = async (req, res) => {
  const { tour } = req.body;

  if (!tour)
    return res.status(400).json({
      success: false,
      message: "Tour id is required.",
    });

  try {
    if (!mongoose.Types.ObjectId.isValid(tour))
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const topdestinations = await topDestinationModel.find({
      status: "active",
    });

    const isAreadyExist = await topDestinationModel.findOne({ tour });

    if (isAreadyExist)
      return res.status(403).json({
        success: false,
        message: "Tour already exist in top destination section.",
      });

    const new_Top_destination_Item = new topDestinationModel({
      tour,
      status: topdestinations.length == 8 ? "inactive" : "active",
    });
    await new_Top_destination_Item.save();
    await clearCacheByPrefix("topDesti");

    res.status(201).json({
      success: true,
      message: "Tour has been added to top destination section.",
      data: new_Top_destination_Item,
    });
  } catch (error) {
    console.log("Error while adding tour in top destinations section.");
    res.status(500).json({
      message: "Error while adding tour in top destinations section.",
      success: false,
    });
  }
};

exports.update_top_destinations_items = async (req, res) => {
  const { tour } = req.body;
  const { id } = req.params;
  if (!tour)
    return res.status(400).json({
      success: false,
      message: "Tour id is required.",
    });

  try {
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(tour)
    )
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const isAreadyExist = await topDestinationModel.findOne({
      tour,
      _id: { $ne: id },
    });

    if (isAreadyExist)
      return res.status(403).json({
        success: false,
        message: "Tour already exist in top destination section.",
      });

    const updatedItem = await topDestinationModel.findByIdAndUpdate(
      id,
      {
        tour,
      },
      { new: true }
    );
    await clearCacheByPrefix("topDesti");

    res.status(200).json({
      success: true,
      message: "Top destination's tour item has been updated.",
      updatedItem,
    });
  } catch (error) {
    console.log("Error while updating tour in top destinations section.");
    res.status(500).json({
      message: "Error while updating tour in top destinations section.",
      success: false,
    });
  }
};

exports.delete_tour_from_top_destination = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const destination = await topDestinationModel.findById(id);
    if (!destination)
      return res
        .status(404)
        .json({ success: false, message: "Tour Destination not found" });

    await topDestinationModel.findByIdAndDelete(id);
    await clearCacheByPrefix("topDesti");

    res.status(200).json({
      success: true,
      message: "Tour has been deleted from top destinations section.",
    });
  } catch (error) {
    console.log("Error while deleting tour in top destinations section.");
    res.status(500).json({
      message: "Error while deleting tour in top destinations section.",
      success: false,
    });
  }
};

exports.get_active_top_destinations_tours = async (req, res) => {
  try {
    const tours = await topDestinationModel
      .find({ status: "active" })
      .populate("tour");
    res.status(200).json({
      success: true,
      tours,
    });
  } catch (error) {
    console.log("Error while fetching tour of top destinations section.");
    res.status(500).json({
      message: "Error while fetching tour of top destinations section.",
      success: false,
    });
  }
};

exports.topDestinationToggleStatus = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const tours = await topDestinationModel.find({ status: "active" });

  const topDesti = await topDestinationModel.findById(id);

  if (!topDesti)
    return res.status(404).json({ success: false, message: "Tour not found" });

  if (topDesti.status == "active") {
    topDesti.status = "inactive";
  } else {
    if (tours.length == 8)
      return res.status(400).json({
        success: false,
        message: "More than 8 tours are not allowed to be active",
      });
    topDesti.status = "active";
  }
  await topDesti.save();
  await clearCacheByPrefix("topDesti");

  res.json({ success: true, message: "Status changed." });
});

exports.deleteMultipleTopDestinations = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const topDesti = await topDestinationModel.findById(id);
    if (!topDesti)
      return res
        .status(404)
        .json({ success: false, message: "Tour place not found" });
    await topDestinationModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("topDesti");

  res.json({ success: true, message: "Tour deleted successfully." });
});

exports.get_all_top_destinations_tours = tryCatchWrapper(async (req, res) => {
  const { status } = req.query;

  let tours = await get(`topDesti:${status}`);

  if (tours) return res.json({ success: true, data: tours });

  tours = await topDestinationModel
    .find(
      status ? { status: status == "inactive" ? "inactive" : "active" } : {}
    )
    .populate("tour", "placeName mainImage");

  await set(`topDesti:${status}`, tours, 3600);

  res.status(200).json({
    success: true,
    data: tours,
  });
});
