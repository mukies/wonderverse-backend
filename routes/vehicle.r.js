const {
  addVehicle,
  deleteVehicle,
  fetchSingleVehicleData,
  fetch_Personal_Vehicles,
  updateDriverDetails,
} = require("../controllers/vehicle.c");
const { partnerProtection } = require("../middlewares/partnerProtection");

const router = require("express").Router();

router.post("/add-vehicle", partnerProtection, addVehicle);
router.delete("/delete-vehicle/:id", partnerProtection, deleteVehicle);

router.get("/all-personal-vehicle", partnerProtection, fetch_Personal_Vehicles);

router.get(
  "/single-vehicle-data/:id",
  partnerProtection,
  fetchSingleVehicleData
);
router.put(
  "/update-vehicle-driver-details/:vehicleID",
  partnerProtection,
  updateDriverDetails
);
router.put(
  "/update-vehicle-driver-details/:vehicleID",
  partnerProtection,
  updateDriverDetails
);

module.exports = router;
