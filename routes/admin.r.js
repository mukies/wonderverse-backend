const { checkSchema } = require("express-validator");
const {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  verifyAdmin,
  loggedInData,
} = require("../controllers/admin.c");
const {
  loginSchema,
  adminRegisterSchema,
} = require("../validationSchema/authSchema");
const { adminProtection } = require("../middlewares/adminProtection");

// const { userProtection } = require("../middlewares/userProtection");

const router = require("express").Router();

router.post("/login", checkSchema(loginSchema), loginAdmin);
router.post("/register", checkSchema(adminRegisterSchema), registerAdmin);
router.post("/logout", logoutAdmin);
router.put("/verify-admin/:uid", verifyAdmin); //payload = otp
router.get("/logged-in-data", adminProtection, loggedInData);

module.exports = router;
