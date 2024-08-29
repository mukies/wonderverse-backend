const { validationResult } = require("express-validator");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const termModel = require("../models/termCondition.m");
const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");
const { get, set } = require("../config/cache_setup");
const { clearCacheByPrefix } = require("../helper/clearCache");

exports.createTerm = tryCatchWrapper(async (req, res) => {
  const { content } = req.body;

  const result = validationResult(req);
  if (!result.array())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const activeTerm = await termModel.find({ status: "active" });

  const newTerm = new termModel({
    content,
    status: activeTerm.length > 0 ? "inactive" : "active",
  });

  await newTerm.save();
  await clearCacheByPrefix("term");

  res.json({
    success: true,
    message: "New term and condition created.",
    data: newTerm,
  });
});

exports.editTerm = tryCatchWrapper(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const result = validationResult(req);
  if (!result.array())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const updatedTerm = await termModel.findByIdAndUpdate(
    id,
    {
      content,
    },
    { new: true }
  );

  await clearCacheByPrefix("term");

  res.json({
    success: true,
    message: "Term and condition updated.",
    data: updatedTerm,
  });
});

exports.singleTerm = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const term = await termModel.findById(id);

  if (!term)
    return res
      .status(404)
      .json({ success: false, message: "Term and condition not found" });

  res.json({
    success: true,
    data: term,
  });
});

exports.activeTerm = tryCatchWrapper(async (req, res) => {
  const term = await termModel.findOne({ status: "active" });

  res.json({
    success: true,
    data: term,
  });
});

exports.allTerms = tryCatchWrapper(async (req, res) => {
  let term = await get("termAll");

  if (term) return res.json({ success: true, data: term });

  term = await termModel.find();
  await set("termAll", term, 3600);

  res.json({
    success: true,
    data: term,
  });
});

exports.deleteTerm = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const term = await termModel.findById(id);
  if (!term)
    return res
      .status(404)
      .json({ success: false, message: "Term and condition not found" });

  await termModel.findByIdAndDelete(id);
  await clearCacheByPrefix("term");

  res.json({
    success: true,
    message: "Successfully deleted.",
  });
});

exports.deleteMultiTerms = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.array())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const term = await termModel.findById(id);
    if (!term)
      return res.status(404).json({
        success: false,
        message: "Some of Term and condition not found",
      });

    await termModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("term");

  res.json({
    success: true,
    message: "Successfully deleted",
  });
});

exports.termStatusToggle = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const term = await termModel.findById(id);
  const terms = await termModel.find({ status: "active" });
  if (!term)
    return res
      .status(404)
      .json({ success: false, message: "Term and condition not found" });

  if (term.status == "active") {
    term.status = "inactive";
  } else {
    if (terms.length > 0)
      return res.status(400).json({
        success: false,
        message: "No more than 1 activation allowed.",
      });
    term.status = "active";
  }

  await term.save();
  await clearCacheByPrefix("term");

  res.json({
    success: true,
    message: "Status changed.",
  });
});
