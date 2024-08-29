const { body } = require("express-validator");
const {
  activeTerm,
  allTerms,
  createTerm,
  editTerm,
  deleteTerm,
  deleteMultiTerms,
  termStatusToggle,
  singleTerm,
} = require("../controllers/termCondition.c");
const { adminProtection } = require("../middlewares/adminProtection");

const router = require("express").Router();

router.get("/active", activeTerm);

//admin routes
router.get("/all", adminProtection, allTerms);
router.get("/single/:id", adminProtection, singleTerm);
router.post(
  "/add",
  adminProtection,
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),
  createTerm
);
router.put(
  "/update/:id",
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),
  adminProtection,
  editTerm
);
router.delete("/delete/:id", adminProtection, deleteTerm);
router.delete(
  "/multi-delete",
  adminProtection,
  body("idArray")
    .notEmpty()
    .withMessage("Id array is required")
    .isArray()
    .withMessage("id array must be an array"),
  deleteMultiTerms
);
router.patch("/toggle-status/:id", adminProtection, termStatusToggle);

module.exports = router;
