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

const router = require("express").Router();

router.post("/login", checkSchema(loginSchema), loginUser);
router.post("/register", checkSchema(userRegisterSchema), registerUser);
router.post("/logout", logoutUser);
router.put("/verify-user/:uid", verifyUser); //payload = otp
router.get("/get/:userID", fetchUser);
router.post("/tour-rating/:tourID", userProtection, tourRating); //payload = rating, comment

module.exports = router;
