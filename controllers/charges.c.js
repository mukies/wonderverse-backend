const { validationResult } = require("express-validator");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { chargesModel } = require("../models/charges.m");
const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");

exports.addCharges = tryCatchWrapper(async (req, res) => {
  const { serviceCharge, taxPercent, insuranceCharge } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const isAlreadyExist = await chargesModel.find();

  if (isAlreadyExist.length > 0)
    return res.status(409).json({
      success: false,
      message: "All additional charges already decleared.",
    });

  const newCharges = new chargesModel({
    insuranceCharge,
    serviceCharge,
    taxPercent,
  });
  await newCharges.save();
  res.json({
    success: true,
    message: "Additional charges added.",
    data: newCharges,
  });
});
exports.updateCharges = tryCatchWrapper(async (req, res) => {
  const { serviceCharge, taxPercent, insuranceCharge } = req.body;
  const { id } = req.params;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const updatedCharges = await chargesModel.findByIdAndUpdate(
    id,
    {
      insuranceCharge,
      serviceCharge,
      taxPercent,
    },
    { new: true }
  );
  res.json({
    success: true,
    message: "Additional charges added.",
    data: updatedCharges,
  });
});

exports.allCharges = tryCatchWrapper(async (req, res) => {
  const charges = await chargesModel.find();
  res.json({ success: true, data: charges });
});
exports.singleCharges = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const charge = await chargesModel.findById(id);

  if (!charge)
    return res
      .status(404)
      .json({ success: false, message: "Charges list didnot found" });

  res.json({ success: true, data: charge });
});
