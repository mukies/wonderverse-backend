const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const contactUsModel = mongoose.model("Contact", contactUsSchema);

module.exports = contactUsModel;
