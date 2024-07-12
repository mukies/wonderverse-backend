const {
  createRoute,
  editRoute,
  toggleAvailable,
  deleteRoute,
  fetchSingleRouteData,
  fetchPersonalRoutes,
} = require("../controllers/route.c");
const { partnerProtection } = require("../middlewares/partnerProtection");

const router = require("express").Router();

router.get("/single-route-data/:id", partnerProtection, fetchSingleRouteData);
router.get("/personal-routes", partnerProtection, fetchPersonalRoutes);
router.post("/:vehicleID/create-route", partnerProtection, createRoute);
router.put("/:vehicleID/update-route/:routeID", partnerProtection, editRoute);

router.put("/toggle-availability/:id", partnerProtection, toggleAvailable);
router.delete("/delete-route/:id", partnerProtection, deleteRoute);
module.exports = router;
