const { checkSchema } = require("express-validator");
const {
  createTour,
  singleTour,
  deleteTour,
  editTour,
  getToursByState,
  getToursByActivity,
  allTours,
  featuredTrips,
} = require("../controllers/tour.c");
const { adminProtection } = require("../middlewares/adminProtection");
const { tourSchema } = require("../validationSchema/tourSchema");

const router = require("express").Router();

router.get("/destination/:slug", getToursByState);
router.get("/activities/:slug", getToursByActivity);
router.get("/tour-details/:tourID", singleTour);
router.get("/featured-trips", featuredTrips);
//admin routes

router.get("/all", adminProtection, allTours);
router.post(
  "/create-tour",
  adminProtection,
  checkSchema(tourSchema),
  createTour
);
router.put(
  "/update-tour/:tourID",
  adminProtection,
  checkSchema(tourSchema),
  editTour
);
router.delete("/delete-tour/:tourID", adminProtection, deleteTour);

module.exports = router;
