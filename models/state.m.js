const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
  },
  { timestamps: true }
);

const stateModel = mongoose.model("State", stateSchema);

module.exports = stateModel;
