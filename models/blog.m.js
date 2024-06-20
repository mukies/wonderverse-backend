const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    blogTitle: { type: String, required: true },
    image: { type: String, default: "" },
    blogContent: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
