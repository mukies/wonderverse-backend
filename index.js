const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
require("./config/database");
require("./config/passport-setup");
const multer = require("multer");
const cookie = require("cookie-parser");
const { v2 } = require("cloudinary");
const tourRoute = require("./routes/tour.r");
const packageRoute = require("./routes/tourPackage.r");
const vehicle_Route = require("./routes/vehicleRoute.r");
const vehicle = require("./routes/vehicle.r");
const guideRoute = require("./routes/guide.r");
const hotelRoute = require("./routes/hotel.r");
const state_and_activities_route = require("./routes/state_and_activities.r");
const userRoute = require("./routes/user.r");
const faqRoute = require("./routes/faq.r");
const sponsorRoute = require("./routes/sponsor.r");
const planRoute = require("./routes/guidePlan.r");
const chargesRoute = require("./routes/charges.r");
const bookingRoute = require("./routes/booking.r");
const adminRoute = require("./routes/admin.r");
const locationRoute = require("./routes/location.r");
const passport = require("passport");
const topDestinationRoute = require("./routes/top_Destination.r");
const contactUsRoute = require("./routes/contact_us.r");
const blogRoute = require("./routes/blog.r");
const googleAuthRoute = require("./routes/googleAuth.r");
const esewaRoute = require("./routes/esewa.r");
const partnerRoute = require("./routes/partner.r");
const termRoute = require("./routes/termCondition.r");
const policyRoute = require("./routes/dataPolicy.r");
const partnerRequestRoute = require("./routes/partnerRequests.r");

//multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.none());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
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
app.use("/api/booking", bookingRoute);
app.use("/api/package", packageRoute);
app.use("/api/location", locationRoute);
app.use("/api/vehicle-route", vehicle_Route);
app.use("/api/vehicle", vehicle);
app.use("/api/user", userRoute);
app.use("/api/pay/esewa", esewaRoute);
app.use("/api/faq", faqRoute);
app.use("/api/term", termRoute);
app.use("/api/policy", policyRoute);
app.use("/api/charges", chargesRoute);
app.use("/api/partner", partnerRoute);
app.use("/api/sponsor", sponsorRoute);
app.use("/api/partner-request", partnerRequestRoute);
app.use("/api/hotel", hotelRoute);
app.use("/api/guide", guideRoute);
app.use("/api/guide-plan", planRoute);
app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);
app.use("/api/top-destination", topDestinationRoute);
app.use("/api/contact-us", contactUsRoute);
app.use("/api/category", state_and_activities_route);

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Invalid API endpoint." });
});

// app.use("/api/booking", bookingRoute);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
