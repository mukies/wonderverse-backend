const {
  addHotel,
  editHotelDetails,
  fetch_All_Personal_Hotels,
  fetch_Single_Hotel_data,
  deleteHotel,
} = require("../controllers/hotel.c");
const { partnerProtection } = require("../middlewares/partnerProtection");

const router = require("express").Router();

router.post("/add-hotel", partnerProtection, addHotel);
router.put("/update-hotel/:id", partnerProtection, editHotelDetails);
router.get("/personal-hotels", partnerProtection, fetch_All_Personal_Hotels);
router.get(
  "/single-hotel-data/:id",
  partnerProtection,
  fetch_Single_Hotel_data
);
router.delete("/delete-hotel/:id", partnerProtection, deleteHotel);

//fetchHotelByTourId function from hotel.c is already included while fetching tour details

module.exports = router;
