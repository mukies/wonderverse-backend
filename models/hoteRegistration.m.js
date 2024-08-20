const mongoose = require("mongoose");

const hotelRegistrationSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    tour: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tour",
      required: true,
    },
    hotelDocuments: {
      ownerName: { type: String, required: true },
      ownerCitizenshipPhoto: { type: [String], required: true },
      hotelRegistrationNumber: { type: String, required: true },
      hotelRegistrationPhoto: { type: String, required: true },
      hotelPanNumber: { type: String, required: true },
      hotelPanNumberPhoto: { type: String, required: true },
    },
    hotelDetails: {
      hotelName: { type: String, required: true },
      hotelEmail: { type: String, required: true },
      hotelContactNumber: { type: String, required: true },
      hotelMainImage: { type: String, required: true },
      hotelLocation: { type: String, required: true },
      livingCostPerDayPerPerson: { type: Number, required: true },
      hotelDesc: { type: String, sparse: true },
      featureImages: { type: [String], default: [] },
    },

    isAvailable: { type: Boolean, default: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionMessage: { type: String, sparse: true },
  },
  { timestamps: true }
);

const hotelRegistrationModel = mongoose.model("Hotel", hotelRegistrationSchema);

module.exports = hotelRegistrationModel;
