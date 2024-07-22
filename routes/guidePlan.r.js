const { checkSchema } = require("express-validator");
const {
  addPlan,
  editPlan,
  deletePlan,
  fetchAllPlan,
  fetchPlanDetails,
} = require("../controllers/guidePlan.c");
const { partnerProtection } = require("../middlewares/partnerProtection");
const {
  planSchema,
  planUpdateSchema,
} = require("../validationSchema/guideSchema");

const router = require("express").Router();

router.post(
  "/add-plan/:guideID",
  partnerProtection,
  checkSchema(planSchema),
  addPlan
);
router.get("/guide-plan-data/:planID", partnerProtection, fetchPlanDetails);
router.put(
  "/:guideID/update-plan/:planID",
  partnerProtection,
  checkSchema(planUpdateSchema),
  editPlan
);
router.delete("/delete-plan/:planID", partnerProtection, deletePlan);
router.get("/all-plans/", partnerProtection, fetchAllPlan);

module.exports = router;
