const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    tourID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    hotelName: { type: String, required: true },
    hotelMainImage: { type: String, required: true },
    livingCostPerDayPerPerson: { type: Number, required: true },
    hotelDesc: { type: String, default: "" },
    hotelContactNumber: { type: String, required: true },
    hotelLocation: { type: String, required: true },
    featureImages: { type: [String], default: [] },
  },
  { timestamps: true }
);

const hotelModel = mongoose.model("Hotel", hotelSchema);

module.exports = hotelModel;
