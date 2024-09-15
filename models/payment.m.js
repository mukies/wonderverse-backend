// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "tourType",
    required: true,
  },
  tourType: {
    type: String,
    enum: ["Booking", "PackageBooking"],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  transaction_code: { type: String },
  currency: { type: String, enum: ["npr", "usd"], default: "N/A" },
  status: { type: String, enum: ["succeeded", "failed"], default: "N/A" },
  paymentMethod: { type: String, enum: ["esewa", "khalti"], default: "N/A" },
  payDate: { type: Date, default: Date.now() },
});

const paymentModel = mongoose.model("Payment", paymentSchema);
module.exports = paymentModel;
