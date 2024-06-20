const mongoose = require("mongoose");

const topDealSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
  },
  { timestamps: true }
);

const topDealModel = mongoose.model("TopDeal", topDealSchema);

module.exports = topDealModel;
