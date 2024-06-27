const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    photo: { type: String, default: "" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    OTP: { type: String, required: true },
    OTPExpiryDate: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    passwordRecoveryCode: { type: String, default: "" },
    // bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
