const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
  },
  { timestamps: true }
);

const placeModel = mongoose.model("PackagePlace", placeSchema);

module.exports = placeModel;
