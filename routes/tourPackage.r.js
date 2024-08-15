const { checkSchema, body } = require("express-validator");
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
  deleteMultiplePackage,
  deleteMultiplePlace,
  packageToggleStatus,
  placeToggleStatus,
  getAllPlaceWithoutPagination,
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
router.delete(
  "/delete-multi-package",
  adminProtection,
  body("idArray")
    .notEmpty()
    .withMessage("Id array is required")
    .isArray()
    .withMessage("id array must be an array"),
  deleteMultiplePackage
);
router.get("/single-package/:slug", getSinglePackage);
router.get("/all-package", getAllPackage);
router.get("/search-package", searchPackage);
router.patch(
  "/toggle-package-status/:id",
  adminProtection,
  packageToggleStatus
);

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
router.delete(
  "/delete-multi-place",
  adminProtection,
  body("idArray")
    .notEmpty()
    .withMessage("Id array is required")
    .isArray()
    .withMessage("id array must be an array"),
  deleteMultiplePlace
);
router.delete("/delete-package-place/:id", adminProtection, deletePlace);
router.get("/all-package-place-paginate", adminProtection, getAllPlace);
router.get("/all-package-place", adminProtection, getAllPlaceWithoutPagination);
router.get("/single-package-place/:id", adminProtection, getOnePlace);
router.patch("/toggle-place-status/:id", adminProtection, placeToggleStatus);

module.exports = router;
