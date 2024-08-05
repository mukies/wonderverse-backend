const mongoose = require("mongoose");

const packageBookingschema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      contactNumber: { type: String, required: true },
      country: { type: String, required: true },
      passportNumber: { type: String, default: "" },
    },

    packageID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    selectedPlaces: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "PackagePlace",
      default: [],
    },

    numberOfPeople: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    startingDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    totalPackageCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const packageBookingModel = mongoose.model(
  "PackageBooking",
  packageBookingschema
);

module.exports = packageBookingModel;
