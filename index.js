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
const guideRoute = require("./routes/guide.r");
const hotelRoute = require("./routes/hotel.r");
const state_and_activities_route = require("./routes/state_and_activities.r");
const userRoute = require("./routes/user.r");
const adminRoute = require("./routes/admin.r");
const locationRoute = require("./routes/location.r");
const passport = require("passport");
const topDestinationRoute = require("./routes/top_Destination.r");
const contactUsRoute = require("./routes/contact_us.r");
const blogRoute = require("./routes/blog.r");
require("./config/passport-setup");
const googleAuthRoute = require("./routes/googleAuth.r");
const partnerRoute = require("./routes/partner.r");
const { body } = require("express-validator");
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
app.use("/api/location", locationRoute);
app.use("/api/vehicle-route", vehicle_Route);
app.use("/api/vehicle", vehicle);
app.use("/api/user", userRoute);
app.use("/api/partner", partnerRoute);
app.use("/api/hotel", hotelRoute);
app.use("/api/guide", guideRoute);
app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);
app.use("/api/top-destination", topDestinationRoute);
app.use("/api/contact-us", contactUsRoute);
app.use("/api/category", state_and_activities_route);
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "server is ok." });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Invalid API endpoint." });
});

// app.use("/api/booking", bookingRoute);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
