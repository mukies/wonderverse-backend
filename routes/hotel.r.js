const { checkSchema } = require("express-validator");
const {
  addHotel,
  editHotelDetails,
  fetch_All_Personal_Hotels,
  fetch_Single_Hotel_data,
  deleteHotel,
  allApprovedHotel,
  toggleHotelAvailability,
} = require("../controllers/hotel.c");
const { partnerProtection } = require("../middlewares/partnerProtection");
const { hotelSchema } = require("../validationSchema/hotelSchema");
const { adminProtection } = require("../middlewares/adminProtection");
const { adminAndPartnerGuard } = require("../middlewares/adminAndPartnerGuard");

const router = require("express").Router();

router.post(
  "/add-hotel",
  partnerProtection,
  checkSchema(hotelSchema),
  addHotel
);
router.put(
  "/update-hotel/:id",
  partnerProtection,
  checkSchema(hotelSchema),
  editHotelDetails
);
router.get("/personal-hotels", partnerProtection, fetch_All_Personal_Hotels);
router.get(
  "/single-hotel-data/:id",
  partnerProtection,
  fetch_Single_Hotel_data
);
router.delete("/delete-hotel/:id", partnerProtection, deleteHotel);

//fetchHotelByTourId function from hotel.c is already included while fetching tour details

//admin
router.get("/all-approved-hotel", adminProtection, allApprovedHotel);
router.patch(
  "/toggle-availability/:id",
  adminAndPartnerGuard,
  toggleHotelAvailability
);

module.exports = router;
