const mongoose = require("mongoose");

const database = (async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("database connected successfully.");
})();

module.exports = database;
