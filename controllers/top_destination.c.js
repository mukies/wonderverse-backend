const topDestinationModel = require("../models/top_destination.m");
const mongoose = require("mongoose");

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

    const topdestinations = await topDestinationModel.find();
    if (topdestinations.length == 8)
      return res.status(400).json({
        success: false,
        message:
          "No more than 8 tour item is allowed into top destination section.",
      });

    const isAreadyExist = await topDestinationModel.findOne({ tour });

    if (isAreadyExist)
      return res.status(403).json({
        success: false,
        message: "Tour already exist in top destination section.",
      });

    const new_Top_destination_Item = new topDestinationModel({ tour });
    await new_Top_destination_Item.save();
    res.status(201).json({
      success: true,
      message: "Tour has been added to top destination section.",
      new_Top_destination_Item,
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

exports.get_top_destinations_tours = async (req, res) => {
  try {
    const tours = await topDestinationModel.find().populate("tour");
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
