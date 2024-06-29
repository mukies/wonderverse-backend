const { checkSchema } = require("express-validator");
const {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  verifyAdmin,
} = require("../controllers/admin.c");
const {
  loginSchema,
  adminRegisterSchema,
} = require("../validationSchema/authSchema");

// const { userProtection } = require("../middlewares/userProtection");

const router = require("express").Router();

router.post("/login", checkSchema(loginSchema), loginAdmin);
router.post("/register", checkSchema(adminRegisterSchema), registerAdmin);
router.post("/logout", logoutAdmin);
router.put("/verify-admin/:uid", verifyAdmin); //payload = otp

module.exports = router;
