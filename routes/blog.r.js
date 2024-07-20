const {
  createPost,
  deletePost,
  editPost,
  allBlogPost,
  singlePost,
  personalPost,
  adminDeletePost,
  like_toggle,
  addComment,
  deleteComment,
  delete_Comment_By_Owner,
} = require("../controllers/blog.c");
const { adminProtection } = require("../middlewares/adminProtection");
const { userProtection } = require("../middlewares/userProtection");
const router = require("express").Router();

//user routes
router.get("/all-posts", allBlogPost);
router.get("/user-personal-posts", userProtection, personalPost);
router.get("/single-post/:postID", singlePost);
router.post("/create-post", userProtection, createPost);
router.post("/add-comment/:postID", userProtection, addComment);
router.delete(
  "/:postID/delete-comment/:commentID",
  userProtection,
  deleteComment
);
router.delete(
  "/:postID/delete-comment-by-owner/:commentID",
  userProtection,
  delete_Comment_By_Owner
);
router.patch("/like-unlike-post/:postID", userProtection, like_toggle);
router.put("/edit-post/:postID", userProtection, editPost);
router.delete("/delete-post/:postID", userProtection, deletePost);

//admin action
router.delete("/delete-post-admin/:postID", adminProtection, adminDeletePost);

module.exports = router;
