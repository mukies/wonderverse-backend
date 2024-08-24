const { validationResult } = require("express-validator");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { faqModel } = require("../models/faq.m");
const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");
const { clearCacheByPrefix } = require("../helper/clearCache");
const { get, set } = require("../config/cache_setup");

exports.addFaq = tryCatchWrapper(async (req, res) => {
  const { question, answer } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const newFaq = new faqModel({ question, answer });
  await newFaq.save();
  await clearCacheByPrefix("faq");

  res.json({ success: true, message: "New FAQ created", data: newFaq });
});

exports.editFaq = tryCatchWrapper(async (req, res) => {
  const { question, answer } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const updatedFaq = await faqModel.findByIdAndUpdate(
    id,
    { question, answer },
    { new: true }
  );
  await clearCacheByPrefix("faq");

  res.json({ success: true, message: "FAQ updated", data: updatedFaq });
});

exports.singleFaq = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const faq = await faqModel.findById(id);

  res.json({ success: true, data: faq });
});

exports.allFaq = tryCatchWrapper(async (req, res) => {
  let faq = await get(`faq`);

  if (faq) return res.json({ success: true, data: faq });

  faq = await faqModel.find();
  await set("faq", faq, 3600);
  res.json({ success: true, data: faq });
});

exports.allActiveFaq = tryCatchWrapper(async (req, res) => {
  let faq = await get(`faqActive`);

  if (faq) return res.json({ success: true, data: faq });

  faq = await faqModel.find({ status: "active" });
  await set("faqActive", faq, 3600);

  res.json({ success: true, data: faq });
});

exports.deleteFaq = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const faq = await faqModel.findById(id);
  if (!faq)
    return res.status(404).json({ success: false, message: "FAQ not found" });
  await faqModel.findByIdAndDelete(id);
  await clearCacheByPrefix("faq");
  res.json({ success: true, message: "Data deleted successfully." });
});

exports.deleteMultipleFAQ = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const faq = await faqModel.findById(id);
    if (!faq)
      return res.status(404).json({ success: false, message: "FAQ not found" });
    await faqModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("faq");
  res.json({ success: true, message: "Data deleted successfully." });
});

exports.faqToggleStatus = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const faq = await faqModel.findById(id);

  if (!faq)
    return res.status(404).json({ success: false, message: "FAQ not found" });

  if (faq.status == "active") {
    faq.status = "inactive";
  } else {
    faq.status = "active";
  }
  await clearCacheByPrefix("faq");
  await faq.save();
  res.json({ success: true, message: "Status changed." });
});
