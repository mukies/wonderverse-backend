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
  allToursNames,
  homePageFeaturedTrips,
  searchTour,
  addToFavourite,
  getAllToursByActivity,
  getAllToursByState,
} = require("../controllers/tour.c");
const { adminProtection } = require("../middlewares/adminProtection");
const { tourSchema } = require("../validationSchema/tourSchema");
const { userProtection } = require("../middlewares/userProtection");

const router = require("express").Router();

router.get("/destination/:state", getToursByState);
router.get("/all-destination/:state", getAllToursByState);
router.get("/activities/:slug", getToursByActivity);
router.get("/all-activities/:slug", getAllToursByActivity);
router.get("/tour-details/:slug", singleTour);
// router.get("/featured-trips", featuredTrips);
router.get("/homepage-featured-trips", homePageFeaturedTrips);
router.get("/all-tour-name", allToursNames);
router.get("/search", searchTour);
router.patch("/add-to-fav/:tourID", userProtection, addToFavourite);

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
