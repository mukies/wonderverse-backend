const { checkSchema, body } = require("express-validator");
const {
  registerPartner,
  loginPartner,
  verifyPartner,
  logoutPartner,
  loggedInPartner,
  resetPasswordPartner,
  verifyResetCodePartner,
  requestForgetPassCodePartner,
  allPartners,
} = require("../controllers/partner.c");
const { partnerProtection } = require("../middlewares/partnerProtection");
const {
  partnerRegisterSchema,
  loginSchema,
} = require("../validationSchema/authSchema");
const { resetPasswordSchema } = require("../validationSchema/userSchema");
const { adminProtection } = require("../middlewares/adminProtection");

const router = require("express").Router();

router.post("/register", checkSchema(partnerRegisterSchema), registerPartner);
router.post("/login", checkSchema(loginSchema), loginPartner);
router.post("/logout", logoutPartner);
router.get("/loggedin-user-data", partnerProtection, loggedInPartner);
router.put("/verify/:uid", verifyPartner);
router.put(
  "/request-reset-code",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  requestForgetPassCodePartner
);
router.get("/verify-reset-code/:id", verifyResetCodePartner);
router.put(
  "/reset-password/:id",
  checkSchema(resetPasswordSchema),
  resetPasswordPartner
);

//admin routes
router.get("/all-partners", adminProtection, allPartners);
module.exports = router;
