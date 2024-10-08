const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleID: { type: String, unique: true, default: "" },
    facebookID: { type: String, unique: true, default: "" },
    photo: { type: String, default: "" },
    passportNumber: { type: String, default: "" },
    passportExpiryDate: { type: Date, default: "" },
    arrivalDate: { type: Date, default: "" },
    departureDate: { type: Date, default: "" },
    firstName: { type: String, required: true, default: "" },
    lastName: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "",
      required: true,
    },
    country: { type: String, default: "" },
    email: { type: String, unique: true, required: true },
    favourite: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tour",
      default: [],
    },
    password: String,
    OTP: { type: String }, // for registration
    OTPExpiryDate: { type: Date }, // for registration
    isVerified: { type: Boolean, default: false },
    passwordRecoveryCode: { type: String, default: null },
    passwordRecoveryCodeExpiryDate: { type: Date, default: Date.now },
    isRecoveryCodeUsed: { type: Boolean, default: true },
    isTravelAgent: { type: Boolean, default: false },
    isGuideAgent: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
