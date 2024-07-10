const express = require("express");
const app = express();

require("dotenv").config();
require("./config/database");
const multer = require("multer");
const cookie = require("cookie-parser");
const cors = require("cors");
const { v2 } = require("cloudinary");
const tourRoute = require("./routes/tour.r");
const vehicle_Route = require("./routes/vehicleRoute.r");
const vehicle = require("./routes/vehicle.r");
const state_and_activities_route = require("./routes/state_and_activities.r");
const userRoute = require("./routes/user.r");
const adminRoute = require("./routes/admin.r");
const passport = require("passport");
const topDestinationRoute = require("./routes/top_Destination.r");
const contactUsRoute = require("./routes/contact_us.r");
const blogRoute = require("./routes/blog.r");
require("./config/passport-setup");
const googleAuthRoute = require("./routes/googleAuth.r");
const partnerRoute = require("./routes/partner.r");
const testModel = require("./test/test.m");
// const testModel = require("./test/test.m");
// const {
//   generateTokenAndSetCookie,
// } = require("./helper/generateTokenAndSendCookie");

//multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.none());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

app.use(passport.initialize());

//cloudinary
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//routes
app.use("/auth", googleAuthRoute);
app.use("/api/tour", tourRoute);
app.use("/api/vehicle-route", vehicle_Route);
app.use("/api/vehicle", vehicle);
app.use("/api/user", userRoute);
app.use("/api/partner", partnerRoute);
app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);
app.use("/api/top-destination", topDestinationRoute);
app.use("/api/contact-us", contactUsRoute);
app.use("/api/category", state_and_activities_route);
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "server is ok." });
});

app.post("/add", async (req, res) => {
  const { username, age, name } = req.body;
  try {
    const isExist = await testModel.find({ username });

    if (isExist.length > 0)
      return res
        .status(400)
        .json({ success: false, message: "Username already exist" });

    const newData = new testModel({ username, age: Number(age), name });
    await newData.save();
    res.status(200).json({ success: true, newData, message: "created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error." });
  }
});

app.put("/update/:id", async (req, res) => {
  const { username, age, name } = req.body;
  const { id } = req.params;
  try {
    const isExist = await testModel.findOne({ username, _id: { $ne: id } });
    if (isExist) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const updatedData = await testModel.findByIdAndUpdate(
      id,
      {
        username,
        age,
        name,
      },
      { new: true }
    );
    res.status(200).json({ success: true, updatedData, message: "updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error." });
  }
});

app.get("/get", async (req, res) => {
  try {
    const data = await testModel.find();

    res.status(200).json({ success: true, data, message: "fetched" });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error." });
  }
});
app.get("/single/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await testModel.findById(id);

    res.status(200).json({ success: true, data, message: "fetched" });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error." });
  }
});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await testModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error." });
  }
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Invalid API endpoint." });
});

// app.use("/api/booking", bookingRoute);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
