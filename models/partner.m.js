const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    photo: { type: String, default: "" },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: String,
    partnerType: {
      type: String,
      enum: ["travel", "guide", "hotel"],
      required: true,
    },
    OTP: { type: String }, // for registration
    OTPExpiryDate: { type: Date }, // for registration
    isVerified: { type: Boolean, default: false },
    passwordRecoveryCode: { type: String, default: "" },
  },
  { timestamps: true }
);

const partnerModel = mongoose.model("Partner", partnerSchema);

module.exports = partnerModel;
