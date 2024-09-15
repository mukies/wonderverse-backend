const { checkSchema } = require("express-validator");
const { newTourBooking } = require("../controllers/booking.c");
const {
  bookingSchema,
  packageBookingSchema,
} = require("../validationSchema/bookingSchema");
const { userProtection } = require("../middlewares/userProtection");
const { newPackageBooking } = require("../controllers/packageBooking.c");

const router = require("express").Router();

router.post(
  "/tour-booking/:tourID",
  userProtection,
  checkSchema(bookingSchema),
  newTourBooking
);

router.post(
  "/package-booking/:packageID",
  userProtection,
  checkSchema(packageBookingSchema),
  newPackageBooking
);

module.exports = router;
