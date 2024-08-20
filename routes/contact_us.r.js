const {
  delete_message,
  submit_message,
  all_messages,
} = require("../controllers/contact_us.c");

const { adminProtection } = require("../middlewares/adminProtection");

const router = require("express").Router();

router.post("/submit-message", submit_message); //payload  = fullName, email, subject, message

//admin routes
router.get("/messages", adminProtection, all_messages);
router.delete("/delete-message/:id", adminProtection, delete_message);

module.exports = router;
