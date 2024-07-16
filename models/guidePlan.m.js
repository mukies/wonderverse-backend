const { Schema, model } = require("mongoose");

const planSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "Partner", required: true },
    guide: { type: Schema.Types.ObjectId, ref: "Guide", required: true },
    tour: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
    plans: { type: String, required: true },
  },
  { timestamps: true }
);

const planModel = model("Plan", planSchema);

module.exports = planModel;
