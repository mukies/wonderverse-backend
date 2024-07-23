const {
  deleteActivity,
  addState,
  updateState,
  deleteState,
  getActivities,
  addActivity,
  updateActivity,
  getAllStates,
  getSingleState,
  getSingleActivity,
} = require("../controllers/state_and_activities.c");
const { adminProtection } = require("../middlewares/adminProtection");

const router = require("express").Router();

//state CRUD
// router.get("/states", getAllStates);
// router.get("/single-state/:id", adminProtection, getSingleState);
// router.post("/add-state", adminProtection, addState);
// router.put("/update-state/:id", adminProtection, updateState);
// router.delete("/delete-state/:id", adminProtection, deleteState);

//activities CRUD
router.get("/activities", getActivities);
router.get("/single-activity/:id", adminProtection, getSingleActivity);
router.post("/add-activities", adminProtection, addActivity);
router.put("/update-activities/:id", adminProtection, updateActivity);
router.delete("/delete-activities/:id", adminProtection, deleteActivity);

module.exports = router;
