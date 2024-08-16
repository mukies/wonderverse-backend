const { checkSchema, body } = require("express-validator");
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
  requestForgetPassCode,
  verifyResetCode,
  resetPassword,
  allUsers,
  deleteUser,
  deleteMultipleUser,
} = require("../controllers/user.c");

const { userProtection } = require("../middlewares/userProtection");
const {
  loginSchema,
  userRegisterSchema,
} = require("../validationSchema/authSchema");
const { ratingSchema } = require("../validationSchema/ratingSchema");
const {
  passportSchema,
  passwordSchema,
  userDetailSchema,
  resetPasswordSchema,
} = require("../validationSchema/userSchema");
const { adminProtection } = require("../middlewares/adminProtection");

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

router.put(
  "/change-user-details",
  userProtection,
  checkSchema(userDetailSchema),
  changeUserDetails
);
router.put("/change-photo", userProtection, changeProfilePhoto);
router.put(
  "/change-passport-details",
  userProtection,
  checkSchema(passportSchema),
  changePassportDetails
);
router.put(
  "/change-password",
  userProtection,
  checkSchema(passwordSchema),
  changePassword
);

router.put(
  "/request-reset-code",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  requestForgetPassCode
);
router.get("/verify-reset-code/:id", verifyResetCode);
router.put(
  "/reset-password/:id",
  checkSchema(resetPasswordSchema),
  resetPassword
);

//admin routes
router.get("/all-users", adminProtection, allUsers);

router.delete(
  "/delete-multi-users",
  adminProtection,
  body("idArray")
    .notEmpty()
    .withMessage("Id array is required")
    .isArray()
    .withMessage("id array must be an array"),
  deleteMultipleUser
);

router.delete("/delete-user/:id", adminProtection, deleteUser);

module.exports = router;
