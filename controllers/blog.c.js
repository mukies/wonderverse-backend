const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const blogModel = require("../models/blog.m");

exports.createPost = async (req, res) => {
  const { blogTitle, blogContent } = req.body;
  let { image } = req.body;
  const postedBy = req.user._id;

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
  const userID = req.user._id;
  const { postID } = req.params;

  try {
    const post = await blogModel.findById(postID);

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
  const postedBy = req.user._id;
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
      .populate("postedBy", "firstName lastName ");
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
      .find({ postedBy: req.user._id })
      .populate("postedBy", "firstName lastName ");

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
  try {
    const post = await blogModel
      .findById(postID)
      .populate("postedBy", "firstName lastName")
      .populate("likes", "firstName lastName")
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

exports.adminDeletePost = async (req, res) => {
  const { postID } = req.params;

  try {
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
