const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const placeModel = mongoose.model("PackagePlace", placeSchema);

module.exports = placeModel;
