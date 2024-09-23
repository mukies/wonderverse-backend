const { checkSchema } = require("express-validator");
const {
  newTourBooking,
  allBookings,
  allUsersBookings,
} = require("../controllers/booking.c");
const {
  bookingSchema,
  packageBookingSchema,
} = require("../validationSchema/bookingSchema");
const { userProtection } = require("../middlewares/userProtection");
const {
  newPackageBooking,
  allPackageBookings,
  allUsersPackageBookings,
} = require("../controllers/packageBooking.c");
const { adminProtection } = require("../middlewares/adminProtection");

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

router.get("/all-tour-booking", adminProtection, allBookings);
router.get("/users-all-tour-booking", userProtection, allUsersBookings);

router.get("/all-package-booking", adminProtection, allPackageBookings);
router.get(
  "/users-all-package-booking",
  userProtection,
  allUsersPackageBookings
);

module.exports = router;
