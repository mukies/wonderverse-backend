const topDestinationModel = require("../models/top_destination.m");

exports.add_in_top_destination = async (req, res) => {
  const { tour } = req.body;

  if (!tour)
    return res.status(400).json({
      success: false,
      message: "Tour id is required.",
    });

  try {
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
    const isAreadyExist = await topDestinationModel.findOne({ tour });

    if (isAreadyExist)
      return res.status(403).json({
        success: false,
        message: "Tour already exist in top destination section.",
      });

    const updated_Top_destination_Item =
      await topDestinationModel.findByIdAndUpdate(id, {
        tour,
      });
    await updated_Top_destination_Item.save();
    res.status(200).json({
      success: true,
      message: "Top destination's tour item has been updated.",
      updated_Top_destination_Item,
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
    const top_destinations_tours = await topDestinationModel
      .find()
      .populate("tour");
    res.status(200).json({
      success: true,
      top_destinations_tours,
    });
  } catch (error) {
    console.log("Error while fetching tour of top destinations section.");
    res.status(500).json({
      message: "Error while fetching tour of top destinations section.",
      success: false,
    });
  }
};
