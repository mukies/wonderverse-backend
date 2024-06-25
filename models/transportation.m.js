const mongoose = require("mongoose");

const transportationSchema = new mongoose.Schema(
  {
    tourID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    from: { type: String, required: true },
    transportationType: { type: String, required: true },
    costPerPerson: { type: Number, required: true },
    capacity: { type: Number, default: "N/A" },
    transportationDesc: { type: String, default: "" },
    contactNumber: { type: String, required: true },
    contactEmail: { type: String, required: true },
    estimatedDuration: { type: String, required: true },
  },
  { timestamps: true }
);

const transportationModel = mongoose.model(
  "Transportation",
  transportationSchema
);

module.exports = transportationModel;
