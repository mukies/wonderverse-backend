const {
  rejectGuide,
  allVehicleRequest,
  singleVehicleRequestDetails,
  approveVehicle,
  rejectVehicle,
  allGuideRequest,
  singleGuideRequestDetails,
  approveGuide,
  rejectHotel,
  approveHotel,
  allHotelRequest,
  totalRequest,
} = require("../controllers/partnerRequests.c");
const { adminProtection } = require("../middlewares/adminProtection");

const router = require("express").Router();

//vehicles
router.get("/all-vehicle-requests", adminProtection, allVehicleRequest);

router.patch("/approve-vehicle-requests/:id", adminProtection, approveVehicle);

router.patch("/reject-vehicle-requests/:id", adminProtection, rejectVehicle);

//guides
router.get("/all-guide-requests", adminProtection, allGuideRequest);

router.patch("/approve-guide-requests/:id", adminProtection, approveGuide);

router.patch("/reject-guide-requests/:id", adminProtection, rejectGuide);

//hotels

router.get("/all-hotel-requests", adminProtection, allHotelRequest);

router.patch("/approve-hotel-requests/:id", adminProtection, approveHotel);

router.patch("/reject-hotel-requests/:id", adminProtection, rejectHotel);

//total request
router.get("/total-requests", adminProtection, totalRequest);

module.exports = router;
