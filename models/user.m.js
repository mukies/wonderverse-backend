const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleID: { type: String, unique: true, default: "" },
    facebookID: { type: String, unique: true, default: "" },
    photo: { type: String, default: "" },
    firstName: { type: String, required: true },
    lastName: { type: String },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    country: String,
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
    passwordRecoveryCode: { type: String, default: "" },
    isTravelAgent: { type: Boolean, default: false },
    isGuideAgent: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
