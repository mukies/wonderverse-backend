const {
  registerPartner,
  loginPartner,
  verifyPartner,
  logoutPartner,
  loggedInPartner,
} = require("../controllers/partner.c");
const { partnerProtection } = require("../middlewares/partnerProtection");

const router = require("express").Router();

router.post("/register", registerPartner);
router.post("/login", loginPartner);
router.post("/logout", logoutPartner);
router.get("/loggedin-user-data", partnerProtection, loggedInPartner);
router.put("/verify/:uid", verifyPartner);

module.exports = router;
