const {
  createRoute,
  editRoute,
  toggleAvailable,
  deleteRoute,
  fetchSingleRouteData,
  fetchPersonalRoutes,
} = require("../controllers/route.c");
const { travelPartnerProtection } = require("../middlewares/partnerProtection");

const router = require("express").Router();

router.get(
  "/single-route-data/:id",
  travelPartnerProtection,
  fetchSingleRouteData
);
router.get("/personal-routes", travelPartnerProtection, fetchPersonalRoutes);
router.post("/:vehicleID/create-route", travelPartnerProtection, createRoute);
router.put(
  "/:vehicleID/update-route/:routeID",
  travelPartnerProtection,
  editRoute
);
router.put(
  "/toggle-availability/:id",
  travelPartnerProtection,
  toggleAvailable
);
router.delete("/delete-route/:id", travelPartnerProtection, deleteRoute);
module.exports = router;
