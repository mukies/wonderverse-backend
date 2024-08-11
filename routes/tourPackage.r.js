const { checkSchema } = require("express-validator");
const {
  addPackage,
  updatePackage,
  getSinglePackage,
  addPackagePlaces,
  getAllPackage,
  searchPackage,
  deletePackage,
  updatePackagePlace,
  deletePlace,
  getAllPlace,
  getOnePlace,
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
router.delete("/delete-package/:id", adminProtection, deletePackage);
router.get("/single-package/:slug", getSinglePackage);
router.get("/all-package", getAllPackage);
router.get("/search-package", searchPackage);

//package place
router.post(
  "/add-package-place",
  adminProtection,
  checkSchema(packagePlaceSchema),
  addPackagePlaces
);
router.put(
  "/update-package-place/:id",
  adminProtection,
  checkSchema(packagePlaceSchema),
  updatePackagePlace
);
router.delete("/delete-package-place/:id", adminProtection, deletePlace);
router.get("/all-package-place", adminProtection, getAllPlace);
router.get("/single-package-place/:id", adminProtection, getOnePlace);

module.exports = router;
