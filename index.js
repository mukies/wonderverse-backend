const express = require("express");
const app = express();

require("dotenv").config();
require("./database");

const cookie = require("cookie-parser");
const cors = require("cors");
const { v2 } = require("cloudinary");
const tourRoute = require("./routes/tour.r");
const state_and_activities_route = require("./routes/state_and_activities.r");
const userRoute = require("./routes/user.r");
const topDealsRoute = require("./routes/topDeals.r");
const contactUsRoute = require("./routes/contact_us.r");
const blogRoute = require("./routes/blog.r");
const testModel = require("./test/test.m");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookie());

//cloudinary
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//routes
app.use("/api/tour", tourRoute);
app.use("/api/user", userRoute);
app.use("/api/blog", blogRoute);
app.use("/api/top-deals", topDealsRoute);
app.use("/api/contact-us", contactUsRoute);
app.use("/api/category", state_and_activities_route);

// app.post("/test", async (req, res) => {
//   const { name, rating } = req.body;
//   try {
//     const data = await testModel({ name, rating });
//     await data.save();

//     res.json({ success: true, message: "ok", data });
//   } catch (error) {
//     res.json({ succe: false, error });
//   }
// });

// app.use("/api/booking", bookingRoute);

app.listen(8080, () => {
  console.log("server started at port 8080");
});
