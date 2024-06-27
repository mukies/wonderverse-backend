const {
  get_top_destinations_tours,
  add_in_top_destination,
  update_top_destinations_items,
  delete_tour_from_top_destination,
} = require("../controllers/top_destination.c");
const { adminProtection } = require("../middlewares/adminProtection");
const router = require("express").Router();

router.get("/tours", get_top_destinations_tours);
//admin routes
router.post("/add-tour", adminProtection, add_in_top_destination); //payload  = tour (tour objectID)
router.put("/update-tour/:id", adminProtection, update_top_destinations_items); //payload  = tour (tour objectID)
router.delete(
  "/delete-tour/:id",
  adminProtection,
  delete_tour_from_top_destination
);

module.exports = router;
