const {
  rejectGuide,
  allVehicleRequest,
  singleVehicleRequestDetails,
  approveVehicle,
  rejectVehicle,
  allGuideRequest,
  singleGuideRequestDetails,
  approveGuide,
} = require("../controllers/partnerRequests.c");
const { adminProtection } = require("../middlewares/adminProtection");

const router = require("express").Router();

//vehicles
router.get("/all-vehicle-requests", adminProtection, allVehicleRequest);

router.get(
  "/single-vehicle-requests/:id",
  adminProtection,
  singleVehicleRequestDetails
);

router.patch("/approve-vehicle-requests/:id", adminProtection, approveVehicle);

router.patch("/reject-vehicle-requests/:id", adminProtection, rejectVehicle);

//guides
router.get("/all-guide-requests", adminProtection, allGuideRequest);

router.get(
  "/single-guide-requests/:id",
  adminProtection,
  singleGuideRequestDetails
);

router.patch("/approve-guide-requests/:id", adminProtection, approveGuide);

router.patch("/reject-guide-requests/:id", adminProtection, rejectGuide);

//hotels

module.exports = router;
