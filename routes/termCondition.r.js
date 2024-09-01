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
const validationRules = [
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("useFor")
    .isIn(["user", "partner"])
    .withMessage("Usefor must be either 'user' or 'partner'")
    .notEmpty()
    .withMessage("UseFor is required"),
];

//routes

router.get("/active", activeTerm);

//admin routes
router.get("/all", adminProtection, allTerms);
router.get("/single/:id", adminProtection, singleTerm);
router.post("/add", adminProtection, validationRules, createTerm);
router.put(
  "/update/:id",

  adminProtection,
  validationRules,
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
