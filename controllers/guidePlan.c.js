const { validationResult } = require("express-validator");
const planModel = require("../models/guidePlan.m");

exports.addPlan = async (req, res) => {
  const { tour, plans } = req.body;
  const { guideID } = req.params;

  const result = validationResult(req);
  if (!result.isEmpty())
    res.status(400).json({ success: false, message: result.array()[0].msg });

  try {
    const isExist = await planModel.findOne({ tour, guideID });

    if (isExist)
      return res
        .status(409)
        .json({ success: false, message: "Plan already added for this tour." });

    const newPlan = new planModel({
      createdBy: req.partner,
      guideID,
      plans,
      tour,
    });

    await newPlan.save();

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
    res.status(400).json({ success: false, message: result.array()[0].msg });

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
        guideID,
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
