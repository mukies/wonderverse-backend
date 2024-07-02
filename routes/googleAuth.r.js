const router = require("express").Router();
const passport = require("passport");
const {
  generateTokenAndSetCookie,
} = require("../helper/generateTokenAndSendCookie");

// Auth with Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback route for Google to redirect to
// Hand control to passport to use code to grab profile info

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    await generateTokenAndSetCookie(req.user, res);
    res.redirect(process.env.FRONTEND_URL);
  }
);
module.exports = router;
