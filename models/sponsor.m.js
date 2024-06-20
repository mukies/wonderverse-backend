const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema(
  {
    sponsorName: { type: String, required: true },
    sponsorImage: { type: String, required: true },
    sponsorDescription: { type: [String], default: [] },
  },
  { timestamps: true }
);

const sponsorModel = mongoose.model("Sponsor", sponsorSchema);

module.exports = sponsorModel;
