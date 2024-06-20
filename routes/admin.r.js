const {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  verifyAdmin,
} = require("../controllers/admin.c");

// const { userProtection } = require("../middlewares/userProtection");

const router = require("express").Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/logout", logoutAdmin);
router.put("/verify-user/:uid", verifyAdmin); //payload = otp

module.exports = router;
