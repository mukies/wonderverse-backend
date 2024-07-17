const {
  addGuide,
  editGuideDetails,
  // fetchGuideByTourId,
  fetchAllGuide,
  deleteGuide,
} = require("../controllers/guide.c");
const { partnerProtection } = require("../middlewares/partnerProtection");

const router = require("express").Router();

router.post("/add-guide", partnerProtection, addGuide);
router.put("/update-guide/:id", partnerProtection, editGuideDetails);
// router.get("/fetch-by-tour/:tourID", fetchGuideByTourId);
router.get("/all-guide", partnerProtection, fetchAllGuide);
router.delete("/delete-guide/:id", partnerProtection, deleteGuide);

//fetchGuideByTourId function from guide.c is already included while fetching tour details

module.exports = router;
