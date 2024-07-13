const { checkSchema } = require("express-validator");
const {
  registerPartner,
  loginPartner,
  verifyPartner,
  logoutPartner,
  loggedInPartner,
} = require("../controllers/partner.c");
const { partnerProtection } = require("../middlewares/partnerProtection");
const {
  partnerRegisterSchema,
  loginSchema,
} = require("../validationSchema/authSchema");

const router = require("express").Router();

router.post("/register", checkSchema(partnerRegisterSchema), registerPartner);
router.post("/login", checkSchema(loginSchema), loginPartner);
router.post("/logout", logoutPartner);
router.get("/loggedin-user-data", partnerProtection, loggedInPartner);
router.put("/verify/:uid", verifyPartner);

module.exports = router;
