const { checkSchema } = require("express-validator");
const {
  loginUser,
  registerUser,
  tourRating,
  verifyUser,
  logoutUser,
  fetchUser,
  changeUserDetails,
  changePassword,
  changeProfilePhoto,
  changePassportDetails,
} = require("../controllers/user.c");

const { userProtection } = require("../middlewares/userProtection");
const {
  loginSchema,
  userRegisterSchema,
} = require("../validationSchema/authSchema");
const { ratingSchema } = require("../validationSchema/ratingSchema");

const router = require("express").Router();

router.post("/login", checkSchema(loginSchema), loginUser);
router.post("/register", checkSchema(userRegisterSchema), registerUser);
router.post("/logout", logoutUser);
router.put("/verify-user/:uid", verifyUser); //payload = otp
router.get("/loggedin-user", userProtection, fetchUser);
router.post(
  "/tour-rating/:tourID",
  userProtection,
  checkSchema(ratingSchema),
  tourRating
); //payload = rating, comment

router.put("/change-user-details", userProtection, changeUserDetails);
router.put("/change-photo", userProtection, changeProfilePhoto);
router.put("/change-passport-details", userProtection, changePassportDetails);
router.put("/change-password", userProtection, changePassword);

module.exports = router;
