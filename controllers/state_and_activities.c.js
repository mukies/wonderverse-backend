const slugify = require("slugify");
const stateModel = require("../models/state.m");
const activityModel = require("../models/activity.m");

exports.addState = async (req, res) => {
  const { name } = req.body;

  if (!req.admin)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized action." });

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "State name is required." });

  try {
    const isNameExist = await stateModel.findOne({
      $or: [{ name }, { slug: name.toLowerCase() }],
    });
    if (isNameExist)
      return res
        .status(403)
        .json({ success: false, message: "State name already exist." });

    const newState = new stateModel({
      name,
      slug: slugify(name.toLowerCase(), "+"),
    });

    await newState.save();

    res.status(201).json({
      success: true,
      message: "New state has been created.",
      newState,
    });
  } catch (error) {
    console.log("Error while creating state", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating state." });
  }
};

exports.updateState = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "State name is required." });

  try {
    const isNameExist = await stateModel.findOne({
      $or: [{ name }, { slug: name.toLowerCase() }],
      _id: { $ne: id },
    });
    if (isNameExist)
      return res
        .status(403)
        .json({ success: false, message: "State name already exist." });

    const updatedState = await stateModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name.toLowerCase(), "+"),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "State has been updated.",
      updatedState,
    });
  } catch (error) {
    console.log("Error while updating state", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating state." });
  }
};

exports.deleteState = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.admin)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized action." });

    await stateModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "State has been deleted.",
    });
  } catch (error) {
    console.log("Error while deleting state", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting state." });
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await stateModel.find();

    res.status(200).json({
      success: true,
      states,
    });
  } catch (error) {
    console.log("Error while fetching state", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching state." });
  }
};
exports.getSingleState = async (req, res) => {
  const { id } = req.params;
  try {
    const state = await stateModel.findById(id);

    if (!state)
      return res
        .status(404)
        .json({ success: false, message: "State not found" });

    res.status(200).json({
      success: true,
      state,
    });
  } catch (error) {
    console.log("Error while fetching state", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching state." });
  }
};
//activities

exports.addActivity = async (req, res) => {
  const { title } = req.body;
  if (!req.admin)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized action." });

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Activity title is required." });

  try {
    const isTitleExist = await stateModel.findOne({
      $or: [{ title }, { slug: title.toLowerCase() }],
    });
    if (isTitleExist)
      return res.status(403).json({
        success: false,
        message: "Activity title already exist.",
      });

    const newActivity = new activityModel({
      title,
      slug: slugify(title.toLowerCase(), "+"),
    });

    await newActivity.save();

    res.status(201).json({
      success: true,
      message: "New activity has been created.",
      newActivity,
    });
  } catch (error) {
    console.log("Error while creating activity", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating activity." });
  }
};

exports.updateActivity = async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  if (!req.admin)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized action." });

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Activity title is required." });

  try {
    const isTitleExist = await activityModel.findOne({
      $or: [{ title }, { slug: title.toLowerCase() }],
      _id: { $ne: id },
    });
    if (isTitleExist)
      return res.status(403).json({
        success: false,
        message: "Activity title already exist.",
      });

    const updatedActivity = await activityModel.findByIdAndUpdate(
      id,
      {
        title,
        slug: slugify(title.toLowerCase(), "+"),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Activity has been updated.",
      updatedActivity,
    });
  } catch (error) {
    console.log("Error while updating activity", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating activity." });
  }
};

exports.deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.admin)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized action." });

    await activityModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Activity has been deleted.",
    });
  } catch (error) {
    console.log("Error while deleting state", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting state." });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await activityModel.find();

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.log("Error while fetching activities", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching activities." });
  }
};
exports.getSingleActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await activityModel.findById(id);

    if (!activity)
      return res.status(404).json({
        success: true,
        message: "Activity not found",
      });

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    console.log("Error while fetching activities", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching activities." });
  }
};
