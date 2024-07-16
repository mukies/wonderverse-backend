const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    placeName: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    mainImage: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ["normal", "package"], default: "normal" },
    places: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "PackagePlace",
      sparse: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    avgRating: { type: Number, default: 0 },
    reviews: [
      {
        userID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true },
        message: { type: String, required: true },
      },
    ],
    description: { type: String, default: "" },
    included: { type: String, default: "" },
    excluded: { type: String, default: "" },
    featureImages: { type: [String], required: true },
  },
  { timestamps: true }
);

const tourModel = mongoose.model("Tour", tourSchema);

module.exports = tourModel;
