const { validationResult } = require("express-validator");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");
const { get, set } = require("../config/cache_setup");
const { clearCacheByPrefix } = require("../helper/clearCache");
const policyModel = require("../models/dataPolicy.m");

exports.createPolicy = tryCatchWrapper(async (req, res) => {
  const { content, title, useFor } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const activePolicy = await policyModel.find({ status: "active", useFor });

  const newPolicy = new policyModel({
    content,
    status: activePolicy.length > 0 ? "inactive" : "active",
    title,
    useFor,
  });

  await newPolicy.save();
  await clearCacheByPrefix("policy");

  res.json({
    success: true,
    message: "New data policy created.",
    data: newPolicy,
  });
});

exports.editPolicy = tryCatchWrapper(async (req, res) => {
  const { content, useFor, title } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const updatedPolicy = await policyModel.findByIdAndUpdate(
    id,
    {
      content,
      useFor,
      title,
    },
    { new: true }
  );

  await clearCacheByPrefix("policy");

  res.json({
    success: true,
    message: "Data policy updated.",
    data: updatedPolicy,
  });
});

exports.singlePolicy = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const policy = await policyModel.findById(id);

  if (!policy)
    return res
      .status(404)
      .json({ success: false, message: "Data policy not found" });

  res.json({
    success: true,
    data: policy,
  });
});

exports.activePolicy = tryCatchWrapper(async (req, res) => {
  const policy = await policyModel.findOne({ status: "active" });

  res.json({
    success: true,
    data: policy,
  });
});

exports.allPolicy = tryCatchWrapper(async (req, res) => {
  let policy = await get("policyAll");

  if (policy) return res.json({ success: true, data: policy });

  policy = await policyModel.find();
  await set("policyAll", policy, 3600);

  res.json({
    success: true,
    data: policy,
  });
});

exports.deletePolicy = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const policy = await policyModel.findById(id);
  if (!policy)
    return res
      .status(404)
      .json({ success: false, message: "Data policy not found" });

  await policyModel.findByIdAndDelete(id);
  await clearCacheByPrefix("policy");

  res.json({
    success: true,
    message: "Successfully deleted.",
  });
});

exports.deleteMultiPolicy = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.array())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const policy = await policyModel.findById(id);
    if (!policy)
      return res.status(404).json({
        success: false,
        message: "Some of data policy not found",
      });

    await policyModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("policy");

  res.json({
    success: true,
    message: "Successfully deleted",
  });
});

exports.policyStatusToggle = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const policy = await policyModel.findById(id);
  const policies = await policyModel.find({
    status: "active",
    useFor: policy.useFor,
  });
  if (!policy)
    return res
      .status(404)
      .json({ success: false, message: "Data policy not found" });

  if (policy.status == "active") {
    policy.status = "inactive";
  } else {
    if (policies.length > 0)
      return res.status(400).json({
        success: false,
        message: "No more than 1 activation allowed.",
      });
    policy.status = "active";
  }

  await policy.save();
  await clearCacheByPrefix("policy");

  res.json({
    success: true,
    message: "Status changed.",
  });
});
