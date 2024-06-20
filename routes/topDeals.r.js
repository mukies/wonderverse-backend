const {
  get_topDeals_tours,
  add_in_topDeals,
  update_top_deals_items,
  delete_tour_from_topDeal,
} = require("../controllers/topDeals.c");
const { adminProtection } = require("../middlewares/adminProtection");
const router = require("express").Router();

router.get("/tours", get_topDeals_tours);
//admin routes
router.post("/add-tour", adminProtection, add_in_topDeals); //payload  = tour (tour objectID)
router.put("/update-tour/:id", adminProtection, update_top_deals_items); //payload  = tour (tour objectID)
router.delete("/delete-tour/:id", adminProtection, delete_tour_from_topDeal);

module.exports = router;
