const {
  createRoute,
  editRoute,
  toggleAvailable,
  deleteRoute,
  fetchSingleRouteData,
  fetchPersonalRoutes,
  fetchRoutesInTour,
} = require("../controllers/route.c");
const { partnerProtection } = require("../middlewares/partnerProtection");

const router = require("express").Router();

router.get("/single-route-data/:id", partnerProtection, fetchSingleRouteData);
router.post("/:vehicleID/create-route", partnerProtection, createRoute);
router.get("/personal-routes", partnerProtection, fetchPersonalRoutes);
router.get("/all-route-by-place/:tourID/:placeName", fetchRoutesInTour); //use query params for filter
router.put("/:vehicleID/update-route/:routeID", partnerProtection, editRoute);

router.put("/toggle-availability/:id", partnerProtection, toggleAvailable);
router.delete("/delete-route/:id", partnerProtection, deleteRoute);
module.exports = router;
