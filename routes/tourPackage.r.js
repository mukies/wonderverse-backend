const { checkSchema } = require("express-validator");
const {
  addPackage,
  updatePackage,
  getSinglePackage,
  addPackagePlaces,
  getAllPackage,
} = require("../controllers/tourPackage.c");
const { adminProtection } = require("../middlewares/adminProtection");
const {
  tourPackageSchema,
  packagePlaceSchema,
} = require("../validationSchema/packageSchema");

const router = require("express").Router();

router.post(
  "/add-package",
  adminProtection,
  checkSchema(tourPackageSchema),
  addPackage
);
router.put(
  "/update-package/:packageID",
  adminProtection,
  checkSchema(tourPackageSchema),
  updatePackage
);
router.get("/single-package/:slug", getSinglePackage);
router.get("/all-package", getAllPackage);

//package place
router.post(
  "/add-package-place",
  adminProtection,
  checkSchema(packagePlaceSchema),
  addPackagePlaces
);

module.exports = router;
