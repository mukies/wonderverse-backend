const { checkSchema } = require("express-validator");
const { newTourBooking } = require("../controllers/booking.c");
const { bookingSchema } = require("../validationSchema/bookingSchema");
const { userProtection } = require("../middlewares/userProtection");

const router = require("express").Router();

router.post(
  "/tour-booking/:tourID",
  userProtection,
  checkSchema(bookingSchema),
  newTourBooking
);

module.exports = router;
