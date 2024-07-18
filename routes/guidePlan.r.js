const { addPlan, editPlan } = require("../controllers/guidePlan.c");
const { partnerProtection } = require("../middlewares/partnerProtection");

const router = require("express").Router();

router.post("/add-route/:guideID", partnerProtection, addPlan);
router.get("/guide-plan-data/:guideID", partnerProtection, addPlan);
router.put("/:guideID/update-route/:planID", partnerProtection, editPlan);

module.exports = router;
