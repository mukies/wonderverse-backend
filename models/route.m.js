const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },

    from: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    costPerPerson: { type: Number, required: true },
  },
  { timestamps: true }
);

const routeModel = mongoose.model("Route", routeSchema);

module.exports = routeModel;
