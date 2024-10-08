const { checkSchema } = require("express-validator");
const {
  addGuide,
  editGuideDetails,
  // fetchGuideByTourId,
  fetchAllGuide,
  deleteGuide,
  fetch_all_guiding_destinations_tours,
  singleGuideData,
  allApprovedGuide,
  toggleGuideAvailability,
} = require("../controllers/guide.c");
const { partnerProtection } = require("../middlewares/partnerProtection");
const { guideSchema } = require("../validationSchema/guideSchema");
const { adminProtection } = require("../middlewares/adminProtection");
const { adminAndPartnerGuard } = require("../middlewares/adminAndPartnerGuard");

const router = require("express").Router();

router.post(
  "/add-guide",
  checkSchema(guideSchema),
  partnerProtection,
  addGuide
);
router.put(
  "/update-guide/:id",
  partnerProtection,
  checkSchema(guideSchema),
  editGuideDetails
);
// router.get("/fetch-by-tour/:tourID", fetchGuideByTourId);

router.get(
  "/all-guiding-tours/:guideID",
  partnerProtection,
  fetch_all_guiding_destinations_tours
);
router.get("/single-guide-data/:guideID", partnerProtection, singleGuideData);
router.get("/all-guide", partnerProtection, fetchAllGuide);
router.delete("/delete-guide/:id", partnerProtection, deleteGuide);

//fetchGuideByTourId function from guide.c is already included while fetching tour details

//admin
router.get("/all-approved-guide", adminProtection, allApprovedGuide);
router.patch(
  "/toggle-availability/:id",
  adminAndPartnerGuard,
  toggleGuideAvailability
);

module.exports = router;
