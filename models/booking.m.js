const mongoose = require("mongoose");

const bookingschema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userDetails: [
      {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        contactNumber: { type: String, required: true },
        country: { type: String, required: true },
        passportNumber: { type: String, default: "" },
      },
    ],

    tourID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    selectedGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      default: "",
    },
    selectedTransportation: {
      transportation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transportation",
        required: true,
      },
      numberOfPeople: { type: Number, required: true },
      totalCost: { type: Number, required: true },
    },
    selectedHotel: {
      hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
      },
      numberOfPeople: { type: Number, required: true },
      stayingDays: { type: Number, required: true },
      totalHotelCost: { type: Number, required: true },
    },
    bookingDate: { type: Date, required: true },
    tourStartingDate: { type: Date, required: true },
    participants: { type: Number, required: true },
    status: { type: String, default: "pending" },
    totalTourCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingschema);

module.exports = bookingModel;
