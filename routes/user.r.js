const {
  loginUser,
  registerUser,
  tourRating,
  verifyUser,
  logoutUser,
} = require("../controllers/user.c");
const { userProtection } = require("../middlewares/userProtection");

const router = require("express").Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.put("/verify-user/:uid", verifyUser); //payload = otp

router.post("/tour-rating/:tourID", userProtection, tourRating); //payload = rating, comment

module.exports = router;
