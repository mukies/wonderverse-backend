const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    photo: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    OTP: { type: String }, // for registration
    OTPExpiryDate: { type: Date }, // for registration
    isVerified: { type: Boolean, default: false },
    passwordRecoveryCode: { type: String, sparse: true },
  },
  { timestamps: true }
);

const partnerModel = mongoose.model("Partner", partnerSchema);

module.exports = partnerModel;
