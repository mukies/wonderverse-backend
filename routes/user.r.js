const { checkSchema } = require("express-validator");
const {
  loginUser,
  registerUser,
  tourRating,
  verifyUser,
  logoutUser,
  fetchUser,
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

module.exports = router;
