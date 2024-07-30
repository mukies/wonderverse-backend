const mongoose = require("mongoose");

const chargesSchema = new mongoose.Schema(
  {
    serviceCharge: { type: Number, default: 0 },
    insuranceCharge: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

exports.chargesModel = mongoose.model("Charges", chargesSchema);
