const { body } = require("express-validator");
const {
  getAllActiveSponsor,
  addSponsor,
  editSponsor,
  deleteSponsor,
  sponsorMultiDelete,
  sponsorToggleStatus,
} = require("../controllers/sponsor.c");
const { adminProtection } = require("../middlewares/adminProtection");

const router = require("express").Router();

router.get("/all-active", getAllActiveSponsor);

//admin routes
router.get("/all", adminProtection, getAllActiveSponsor);

router.post("/add", adminProtection, addSponsor);

router.put("/update/:id", adminProtection, editSponsor);

router.delete("/delete/:id", adminProtection, deleteSponsor);

router.delete(
  "/multi-delete",
  adminProtection,
  body("idArray")
    .notEmpty()
    .withMessage("Id array is required")
    .isArray()
    .withMessage("id array must be an array"),
  sponsorMultiDelete
);

router.patch("/toggle-status/:id", adminProtection, sponsorToggleStatus);

module.exports = router;
