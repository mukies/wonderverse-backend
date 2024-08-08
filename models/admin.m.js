const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    photo: { type: String, default: null },
    OTP: { type: String, required: true },
    OTPExpiryDate: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    passwordRecoveryCode: { type: String, default: null },
    passwordRecoveryCodeExpiryDate: { type: Date, default: Date.now },
    isRecoveryCodeUsed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;
