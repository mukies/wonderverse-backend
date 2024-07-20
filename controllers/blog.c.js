const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const blogModel = require("../models/blog.m");
const mongoose = require("mongoose");

exports.createPost = async (req, res) => {
  const { blogTitle, blogContent } = req.body;
  let { image } = req.body;
  const postedBy = req.user;

  if (!blogContent && !blogTitle)
    return res.status(400).json({
      success: false,
      message: "Blog title and content required.",
    });
  if (!blogContent && !image)
    return res.status(400).json({
      success: false,
      message: "Blog content required.",
    });

  try {
    if (!image.startsWith("http")) {
      image = await generateLink(image);
    }

    const newBlog = new blogModel({ blogTitle, blogContent, postedBy, image });
    await newBlog.save();

    res
      .status(201)
      .json({ success: true, message: "New blog created.", newBlog });
  } catch (error) {
    console.log("Error while creating blog post", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating blog post." });
  }
};

exports.deletePost = async (req, res) => {
  const userID = req.user;
  const { postID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postID))
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });
    const post = await blogModel.findById(postID);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.postedBy.toString() !== userID.toString())
      return res.status(401).json({
        success: false,
        message: "You are not allowed to delete others post.",
      });

    await blogModel.findByIdAndDelete(postID);

    res
      .status(200)
      .json({ success: true, message: "post deleted successfully." });
  } catch (error) {
    console.log("error while deleting the post.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting the post." });
  }
};

exports.editPost = async (req, res) => {
  const { blogTitle, blogContent } = req.body;
  const postedBy = req.user;
  const { postID } = req.params;

  if (!postedBy)
    return res.status(401).json({
      success: false,
      message: "Login to post a blog.",
    });
  if (!blogContent && !blogTitle)
    return res.status(400).json({
      success: false,
      message: "Blog title and content required.",
    });
  if (!mongoose.Types.ObjectId.isValid(postID))
    return res
      .status(401)
      .json({ success: false, message: "Invalid object id" });

  try {
    const post = await blogModel.findById(postID);

    if (post.postedBy.toString() !== userID.toString())
      return res.status(401).json({
        success: false,
        message: "You are not allowed to edit others post.",
      });

    const updatedBlog = await blogModel.findById(postID);

    updatedBlog.blogTitle = blogTitle;
    updatedBlog.blogContent = blogContent;

    await updatedBlog.save();

    res
      .status(200)
      .json({ success: true, message: "Blog updated.", updatedBlog });
  } catch (error) {
    console.log("Error while editing blog post", error);
    res
      .status(500)
      .json({ success: false, message: "Error while editing blog post." });
  }
};

exports.allBlogPost = async (req, res) => {
  try {
    const posts = await blogModel
      .find()
      .populate("postedBy", "firstName lastName photo country");
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log("Error while fetching blog post", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching blog post." });
  }
};

exports.personalPost = async (req, res) => {
  try {
    const posts = await blogModel
      .find({ postedBy: req.user })
      .populate("postedBy", "firstName lastName photo country");

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log("Error while fetching user's blog post", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching user's blog post.",
    });
  }
};

exports.singlePost = async (req, res) => {
  const { postID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postID))
    return res
      .status(401)
      .json({ success: false, message: "Invalid object id" });

  try {
    const post = await blogModel
      .findById(postID)
      .populate("postedBy", "firstName lastName photo country")
      .populate("likes", "firstName lastName photo")
      .populate("comments.commentedBy", "firstName lastName");

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log("Error while fetching blog post details", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching blog post details.",
    });
  }
};

exports.like_toggle = async (req, res) => {
  const { postID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postID))
      return res
        .status(401)
        .json({ success: false, message: "Invalid post id" });

    const post = await blogModel.findById(postID);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    const isLiked = post.likes.includes(req.user);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user);
      await post.save();
    } else {
      post.likes.push(req.user);
      await post.save();
    }

    res.json({
      success: true,
      message: isLiked ? "Like removed" : "post liked",
    });
  } catch (error) {
    console.log("Error while liking the post", error);
    res
      .status(500)
      .json({ success: false, message: "Error while liking the post" });
  }
};

exports.addComment = async (req, res) => {
  const { content } = req.body;
  const { postID } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(postID))
      return res
        .status(401)
        .json({ success: false, message: "Invalid post id" });

    const post = await blogModel.findById(postID);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const comment = {
      commentedBy: req.user,
      content,
    };

    post.comments.push(comment);
    await post.save();

    res.json({
      success: true,
      message: "Comment has been added",
    });
  } catch (error) {
    console.log("Error while commenting in the post", error);
    res
      .status(500)
      .json({ success: false, message: "Error while commenting in the post" });
  }
};

exports.deleteComment = async (req, res) => {
  const { postID, commentID } = req.params;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(postID) ||
      !mongoose.Types.ObjectId.isValid(commentID)
    )
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const post = await blogModel.findById(postID);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const index = post.comments.findIndex(
      (comment) => comment._id.toString() == commentID
    );

    if (index == -1)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });

    const isYourComment =
      post.comments[index].commentedBy.toString() == req.user;

    if (!isYourComment)
      return res
        .status(401)
        .json({ success: false, message: "Unable to delete other's comment" });

    post.comments.splice(index, 1);

    await post.save();

    res.json({
      success: true,
      message: "Comment has been deleted",
    });
  } catch (error) {
    console.log("Error while deleting comment", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting comment" });
  }
};

exports.delete_Comment_By_Owner = async (req, res) => {
  const { postID, commentID } = req.params;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(postID) ||
      !mongoose.Types.ObjectId.isValid(commentID)
    )
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const post = await blogModel.findById(postID);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.postedBy.toString() !== req.user)
      return res.status(401).json({
        success: false,
        message: "Unable to delete other people post's comment",
      });

    const index = post.comments.findIndex(
      (comment) => comment._id.toString() == commentID
    );

    if (index == -1)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    post.comments.splice(index, 1);
    await post.save();

    res.json({ success: true, message: "Comment has been deleted" });
  } catch (error) {
    console.log("Error while deleting comment", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting comment" });
  }
};

//admin action

exports.adminDeletePost = async (req, res) => {
  const { postID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postID))
      return res
        .status(401)
        .json({ success: false, message: "Invalid object id" });

    const post = await blogModel.findById(postID);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found." });

    await blogModel.findByIdAndDelete(postID);

    res
      .status(200)
      .json({ success: true, message: "post deleted by admin successfully." });
  } catch (error) {
    console.log("error while deleting the post.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting the post." });
  }
};
