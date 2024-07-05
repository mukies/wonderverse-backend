const mongoose = require("mongoose");

const vehicleRegistrationSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },

    vehicleName: { type: String, required: true },
    vehiclePhoto: { type: String, required: true },
    billBookPhoto: { type: String, required: true },
    vehicleNumberPlate: { type: String, required: true },
    vehicleCapacity: { type: Number, required: true },
    driverDetails: {
      driverName: { type: String, required: true },
      driverLicencePhoto: { type: String, required: true },
      driverContactNumber: { type: String, required: true },
      conducterName: { type: String, sparse: true },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionMessage: { type: String, sparse: true },
  },
  { timestamps: true }
);

const vehicleRegistrationModel = mongoose.model(
  "Vehicle",
  vehicleRegistrationSchema
);

module.exports = vehicleRegistrationModel;
