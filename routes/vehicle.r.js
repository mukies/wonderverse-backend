const { checkSchema } = require("express-validator");
const {
  addVehicle,
  deleteVehicle,
  fetchSingleVehicleData,
  fetch_Personal_Vehicles,
  updateVehicleDetails,
} = require("../controllers/vehicle.c");
const { partnerProtection } = require("../middlewares/partnerProtection");
const { vehicleSchema } = require("../validationSchema/vehicleSchema");

const router = require("express").Router();

router.post(
  "/add-vehicle",
  partnerProtection,
  checkSchema(vehicleSchema),
  addVehicle
);
router.delete("/delete-vehicle/:id", partnerProtection, deleteVehicle);

router.get("/all-personal-vehicle", partnerProtection, fetch_Personal_Vehicles);

router.get(
  "/single-vehicle-data/:id",
  partnerProtection,
  fetchSingleVehicleData
);
router.put(
  "/update-vehicle-details/:vehicleID",
  partnerProtection,
  checkSchema(vehicleSchema),
  updateVehicleDetails
);

module.exports = router;
