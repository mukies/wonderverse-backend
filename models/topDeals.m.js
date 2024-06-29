const mongoose = require("mongoose");

const topDealSchema = new mongoose.Schema(
  {
    deals: { type: Object, required: true },
  },
  { timestamps: true }
);

const topDealModel = mongoose.model("TopDeal", topDealSchema);

module.exports = topDealModel;
