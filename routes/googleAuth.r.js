const router = require("express").Router();
const passport = require("passport");
const {
  generateTokenAndSetCookie,
} = require("../helper/generateTokenAndSendCookie");

// Auth login
router.get("/login", (req, res) => {
  if (req.user) {
    res.json({
      message: "Login with Google successful",
      success: true,
    });
  }
});

// Auth logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Auth with Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

// Callback route for Google to redirect to
// Hand control to passport to use code to grab profile info
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    // successRedirect: process.env.FRONTEND_URL,
    failureRedirect: "/auth/login/failed",
    session: false,
  }),
  (req, res) => {
    const token = generateTokenAndSetCookie(req.user, res);
    res.redirect(process.env.FRONTEND_URL);
    res.json({ token });
  }
);
module.exports = router;
