const { validationResult } = require("express-validator");
const planModel = require("../models/guidePlan.m");
const mongoose = require("mongoose");
const guideRegistrationModel = require("../models/guideRegistration.m");
const { clearCacheByPrefix } = require("../helper/clearCache");
const { invalidObj } = require("../helper/objectIdHendler");

exports.addPlan = async (req, res) => {
  const { tour, plans } = req.body;
  const { guideID } = req.params;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  try {
    if (
      !mongoose.Types.ObjectId.isValid(tour) ||
      !mongoose.Types.ObjectId.isValid(guideID)
    )
      return invalidObj(res);

    const isExist = await planModel.findOne({ tour, guideID });
    const guide = await guideRegistrationModel.findById(guideID);

    if (!guide)
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });

    if (isExist)
      return res
        .status(409)
        .json({ success: false, message: "Plan already added for this tour." });

    const newPlan = new planModel({
      createdBy: req.partner,
      guide: guideID,
      plans,
      tour,
    });

    guide.plans.push(newPlan);

    await newPlan.save();
    await guide.save();
    await clearCacheByPrefix("tour");
    res.json({ success: true, message: "Plan has been added.", newPlan });
  } catch (error) {
    console.log("Error while adding guide plan", error);
    res
      .status(500)
      .json({ success: false, message: "Error while adding guide plan" });
  }
};

exports.editPlan = async (req, res) => {
  const { tour, plans } = req.body;
  const { guideID, planID } = req.params;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  try {
    const isExist = await planModel.findOne({
      tour,
      guideID,
      _id: { $ne: planID },
    });

    if (isExist)
      return res
        .status(409)
        .json({ success: false, message: "Plan already added for this tour." });

    const updatedPlan = await planModel.findByIdAndUpdate(
      planID,
      {
        guide: guideID,
        plans,
        tour,
      },
      { new: true }
    );

    res.json({ success: true, message: "Plan has been added.", updatedPlan });
  } catch (error) {
    console.log("Error while updating guide plan", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating guide plan" });
  }
};

exports.fetchPlanDetails = async (req, res) => {
  const { planID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(planID))
      return res
        .status(401)
        .json({ success: false, message: "Invalid plan id." });

    const planData = await planModel.findById(planID);

    if (!planData)
      return res
        .status(404)
        .json({ success: false, message: "Guide Plan not found" });

    res.json({ success: true, planData });
  } catch (error) {
    console.log("Error while fetching single plan details", error);
    res.status(500),
      json({
        success: false,
        message: "Error while fetching single plan details",
      });
  }
};

exports.deletePlan = async (req, res) => {
  const { planID } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(planID))
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const plan = await planModel.findById(planID);

    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });

    if (plan.createdBy.toString() !== req.partner)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Unable to delete." });

    await planModel.findByIdAndDelete(planID);

    res.json({ success: true, message: "Guide plan has been deleted" });
  } catch (error) {
    console.log("Error while deleting guide plan.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting guide plan" });
  }
};

exports.fetchAllPlan = async (req, res) => {
  try {
    const plans = await planModel
      .find({ createdBy: req.partner })
      .populate("tour", "placeName slug mainImage")
      .populate("guide", "guideName guidePhoto");

    res.json({ success: true, plans });
  } catch (error) {
    console.log("Error while fetching all plans", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching all plans" });
  }
};
