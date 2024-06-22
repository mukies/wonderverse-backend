const topDealModel = require("../models/topDeals.m");

exports.add_in_topDeals = async (req, res) => {
  const { tour } = req.body;

  if (!tour)
    return res.status(400).json({
      success: false,
      message: "Tour id is required.",
    });

  try {
    const topDeals = await topDealModel.find();
    if (topDeals.length == 8)
      return res.status(400).json({
        success: false,
        message: "No more than 8 tour item is allowed into top deal section.",
      });

    const isAreadyExist = await topDealModel.findOne({ tour });

    if (isAreadyExist)
      return res.status(403).json({
        success: false,
        message: "Tour already exist in top deal section.",
      });

    const newTopDealItem = new topDealModel({ tour });
    await newTopDealItem.save();
    res.status(201).json({
      success: true,
      message: "Tour has been added to top deal section.",
      newTopDealItem,
    });
  } catch (error) {
    console.log("Error while adding tour in top deals section.");
    res.status(500).json({
      message: "Error while adding tour in top deals section.",
      success: false,
    });
  }
};

exports.update_top_deals_items = async (req, res) => {
  const { tour } = req.body;
  const { id } = req.params;
  if (!tour)
    return res.status(400).json({
      success: false,
      message: "Tour id is required.",
    });

  try {
    const isAreadyExist = await topDealModel.findOne({ tour });

    if (isAreadyExist)
      return res.status(403).json({
        success: false,
        message: "Tour already exist in top deal section.",
      });

    const updatedTopDealItem = await topDealModel.findByIdAndUpdate(id, {
      tour,
    });
    await updatedTopDealItem.save();
    res.status(200).json({
      success: true,
      message: "Top deal's tour item has been updated.",
      updatedTopDealItem,
    });
  } catch (error) {
    console.log("Error while updating tour in top deals section.");
    res.status(500).json({
      message: "Error while updating tour in top deals section.",
      success: false,
    });
  }
};

exports.delete_tour_from_topDeal = async (req, res) => {
  const { id } = req.params;

  try {
    await topDealModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Tour has been deleted from top deals section.",
    });
  } catch (error) {
    console.log("Error while deleting tour in top deals section.");
    res.status(500).json({
      message: "Error while deleting tour in top deals section.",
      success: false,
    });
  }
};

exports.get_topDeals_tours = async (req, res) => {
  try {
    const topDeals_tours = await topDealModel.find().populate("tour");
    res.status(200).json({
      success: true,
      topDeals_tours,
    });
  } catch (error) {
    console.log("Error while fetching tour of top deals section.");
    res.status(500).json({
      message: "Error while fetching tour of top deals section.",
      success: false,
    });
  }
};
