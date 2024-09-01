const { Schema, model } = require("mongoose");

const policySchema = new Schema(
  {
    title: { type: String, required: true },
    useFor: { type: String, enum: ["user", "partner"], required: true },
    content: { type: String, required: true },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const policyModel = model("Policy", policySchema);

module.exports = policyModel;
