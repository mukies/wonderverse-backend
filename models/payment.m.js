// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  status: { type: String, enum: ["succeeded", "failed"], default: "succeeded" },
  paymentIntentId: { type: String, required: true },
});

module.exports = mongoose.model("Payment", paymentSchema);
