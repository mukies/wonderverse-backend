const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;
