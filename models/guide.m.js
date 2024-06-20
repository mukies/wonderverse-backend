const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema(
  {
    tourID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    guideName: { type: String, required: true },
    guidePhoto: { type: String, default: "" },
    price: { type: Number, required: true },
    guideDesc: { type: String, default: "" },
    guideContactNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const guideModel = mongoose.model("Guide", guideSchema);

module.exports = guideModel;
