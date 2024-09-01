const { body } = require("express-validator");
const {} = require("../controllers/termCondition.c");
const { adminProtection } = require("../middlewares/adminProtection");
const {
  activePolicy,
  allPolicy,
  singlePolicy,
  createPolicy,
  editPolicy,
  deletePolicy,
  deleteMultiPolicy,
  policyStatusToggle,
} = require("../controllers/dataPolicy.c");

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

router.get("/active", activePolicy);

//admin routes
router.get("/all", adminProtection, allPolicy);
router.get("/single/:id", adminProtection, singlePolicy);
router.post("/add", adminProtection, validationRules, createPolicy);
router.put(
  "/update/:id",

  adminProtection,
  validationRules,
  editPolicy
);
router.delete("/delete/:id", adminProtection, deletePolicy);
router.delete(
  "/multi-delete",
  adminProtection,
  body("idArray")
    .notEmpty()
    .withMessage("Id array is required")
    .isArray()
    .withMessage("id array must be an array"),
  deleteMultiPolicy
);
router.patch("/toggle-status/:id", adminProtection, policyStatusToggle);

module.exports = router;
