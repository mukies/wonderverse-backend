const mongoose = require("mongoose");

const guideRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    citizenshipPhoto: { type: String, required: true },
    nationalIdPhoto: { type: String, default: "" },
    isApproved: { type: Boolean, default: false },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

const guideRequestModel = mongoose.model("TravelRequest", guideRequestSchema);

module.exports = guideRequestModel;
