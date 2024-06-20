const {
  createPost,
  deletePost,
  editPost,
  allBlogPost,
  singlePost,
  personalPost,
  adminDeletePost,
} = require("../controllers/blog.c");
const { adminProtection } = require("../middlewares/adminProtection");
const { userProtection } = require("../middlewares/userProtection");
const router = require("express").Router();

//user routes
router.get("/all-posts", allBlogPost);
router.get("/user-personal-posts", userProtection, personalPost);
router.get("/single-post/:postID", singlePost);
router.post("/create-post", userProtection, createPost);
router.put("/edit-post/:postID", userProtection, editPost);
router.delete("/delete-post/:postID", userProtection, deletePost);
router.delete("/delete-post-admin/:postID", adminProtection, adminDeletePost);

module.exports = router;
