const { body } = require("express-validator");
const {
  add_in_top_destination,
  update_top_destinations_items,
  delete_tour_from_top_destination,
  deleteMultipleTopDestinations,
  topDestinationToggleStatus,
  get_active_top_destinations_tours,
  get_all_top_destinations_tours,
} = require("../controllers/top_destination.c");
const { adminProtection } = require("../middlewares/adminProtection");
const router = require("express").Router();

router.get("/tours", get_active_top_destinations_tours);

//admin routes
router.get("/all-tours", adminProtection, get_all_top_destinations_tours);

router.post("/add-tour", adminProtection, add_in_top_destination); //payload  = tour (tour objectID)
router.put("/update-tour/:id", adminProtection, update_top_destinations_items); //payload  = tour (tour objectID)
router.patch("/toggle-status/:id", adminProtection, topDestinationToggleStatus);
router.delete(
  "/delete-tour/:id",
  adminProtection,
  delete_tour_from_top_destination
);

router.delete(
  "/multiple-delete",
  adminProtection,
  body("idArray")
    .notEmpty()
    .withMessage("Id array is required")
    .isArray()
    .withMessage("id array must be an array"),
  deleteMultipleTopDestinations
);

module.exports = router;
