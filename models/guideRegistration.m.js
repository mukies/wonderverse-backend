const mongoose = require("mongoose");

const guideRegistrationSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },

    citizenshipPhoto: { type: String, required: true },
    nationalIdPhoto: { type: String, sparse: true },
    contactNumber: { type: String, required: true },
    guidingDestinations: { type: [String], ref: "Tour", default: [] },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionMessage: { type: String, sparse: true },
  },
  { timestamps: true }
);

const guideRegistrationModel = mongoose.model("Guide", guideRegistrationSchema);

module.exports = guideRegistrationModel;
