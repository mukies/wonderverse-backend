const mongoose = require("mongoose");

const bookingschema = new mongoose.Schema(
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

    tourID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },

    selectedGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      sparse: true,
    },

    selectedTransportation: {
      transportationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true,
      },

      journeyStartingDate: { type: Date, required: true },
      numberOfPeople: { type: Number, required: true },
      totalCost: { type: Number, required: true },
    },

    selectedHotel: {
      hotelID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
      },
      numberOfPeople: { type: Number, required: true },
      stayingDays: { type: Number, required: true },
      checkInDate: { type: Date, required: true },
      totalHotelCost: { type: Number, required: true },
    },

    bookingDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "failed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    totalTourCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingschema);

module.exports = bookingModel;
