const mongoose = require("mongoose");

const topDestinationSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const topDestinationModel = mongoose.model(
  "TopDestination",
  topDestinationSchema
);

module.exports = topDestinationModel;
