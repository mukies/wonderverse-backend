const slugify = require("slugify");
const stateModel = require("../models/state.m");
const activityModel = require("../models/activity.m");
const { get, set } = require("../config/cache_setup");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { clearCacheByPrefix } = require("../helper/clearCache");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");
const { paginate } = require("../helper/pagination");

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
    const { limit, page, skip } = paginate(req);

    let states = await get(`states:${page}`);
    if (states) return res.json({ success: true, data: states });

    states = await stateModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Activity title is required." });

  try {
    const isTitleExist = await activityModel.findOne({
      $or: [{ title }, { slug: title.toLowerCase() }],
    });

    if (isTitleExist)
      return res.status(409).json({
        success: false,
        message: "Activity title already exist.",
      });

    const newActivity = new activityModel({
      title,
      slug: slugify(title.toLowerCase(), "+"),
    });

    await newActivity.save();
    await clearCacheByPrefix("activity");

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
    await clearCacheByPrefix("activity");

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
    await clearCacheByPrefix("activity");

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

exports.deleteMultiActivity = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const activity = await activityModel.findById(id);
    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    await activityModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("activity");
  res.json({ success: true, message: "Activity deleted successfully." });
});

exports.getActivities = async (req, res) => {
  try {
    let activities = await get("activities");

    if (activities)
      return res.status(200).json({
        success: true,
        activities,
      });

    activities = await activityModel.find();
    await set("activities", activities, 3600);
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

exports.getAllActivity = tryCatchWrapper(async (req, res) => {
  const { limit, page, skip } = paginate(req);

  let activity = await get(`activity:${page}`);
  if (activity) return res.json({ success: true, data: activity });

  activity = await activityModel
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalItems = await activityModel.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);
  const data = {
    activity,
    page,
    totalItems,
    totalPages,
  };

  await set(`activity:${page}`, data, 3600);

  res.json({ success: true, data });
});

exports.toggleActivityStatus = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const activity = await activityModel.findById(id);
  if (!activity)
    return res
      .status(404)
      .json({ success: false, message: "Activity not found" });

  if (activity.status == "active") {
    activity.status = "inactive";
  } else {
    activity.status = "active";
  }
  await activity.save();
  await clearCacheByPrefix("activit");
  res.json({ success: true, message: "Status changed" });
});
