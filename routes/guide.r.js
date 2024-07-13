const {
  addGuide,
  editGuideDetails,
  fetchGuideByTourId,
} = require("../controllers/guide.c");

const router = require("express").Router();

router.post("/add-guide", addGuide);
router.put("/update-guide/:id", editGuideDetails);
router.get("/fetch-by-tour/:tourID", fetchGuideByTourId);

//fetchGuideByTourId function from guide.c is already included while fetching tour details

module.exports = router;
