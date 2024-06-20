const {
  deleteActivity,
  getState,
  addState,
  updateState,
  deleteState,
  getActivities,
  addActivity,
  updateActivity,
} = require("../controllers/state_and_activities.c");
const { adminProtection } = require("../middlewares/adminProtection");

const router = require("express").Router();

//state CRUD
router.get("/states", getState);
router.post("/add-state", adminProtection, addState);
router.put("/update-state/:id", adminProtection, updateState);
router.delete("/delete-state/:id", adminProtection, deleteState);

//activities CRUD
router.get("/activities", getActivities);
router.post("/add-activities", adminProtection, addActivity);
router.put("/update-activities/:id", adminProtection, updateActivity);
router.delete("/delete-activities/:id", adminProtection, deleteActivity);

module.exports = router;
