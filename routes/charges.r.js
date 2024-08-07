const { checkSchema } = require("express-validator");
const {
  allCharges,
  addCharges,
  updateCharges,
  singleCharges,
} = require("../controllers/charges.c");
const { adminProtection } = require("../middlewares/adminProtection");
const { chargesSchema } = require("../validationSchema/chargesSchema");

const router = require("express").Router();

router.get("/all", allCharges);

router.get("/single/:id", adminProtection, singleCharges);

router.post("/add", adminProtection, checkSchema(chargesSchema), addCharges);

router.put(
  "/update/:id",
  adminProtection,
  checkSchema(chargesSchema),
  updateCharges
);

module.exports = router;
