const { checkSchema, body } = require("express-validator");
const {
  allActiveFaq,
  allFaq,
  addFaq,
  editFaq,
  singleFaq,
  deleteFaq,
  deleteMultipleFAQ,
  faqToggleStatus,
} = require("../controllers/faq.c");
const { adminProtection } = require("../middlewares/adminProtection");
const { faqSchema } = require("../validationSchema/faq.schema");

const router = require("express").Router();

router.get("/active-faq", allActiveFaq);

//admin
router.get("/all-faq", adminProtection, allFaq);
router.get("/single-faq/:id", adminProtection, singleFaq);
router.post("/add-faq", adminProtection, checkSchema(faqSchema), addFaq);
router.put("/edit-faq/:id", adminProtection, checkSchema(faqSchema), editFaq);
router.delete("/delete-faq/:id", adminProtection, deleteFaq);
router.delete(
  "/multi-delete-faq",
  adminProtection,
  body("idArray")
    .notEmpty()
    .withMessage("Id array is required")
    .isArray()
    .withMessage("id array must be an array"),
  deleteMultipleFAQ
);

router.patch("/toggle-faq-status/:id", adminProtection, faqToggleStatus);

module.exports = router;
