const { Schema, model } = require("mongoose");

const termSchema = new Schema(
  {
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const termModel = model("Term", termSchema);

module.exports = termModel;
