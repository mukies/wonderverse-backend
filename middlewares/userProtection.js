const jwt = require("jsonwebtoken");
const userModel = require("../models/user.m");

exports.userProtection = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });

    const decode = jwt.verify(token, process.env.JWT_KEY);
    if (!decode)
      return res.status(400).json({ success: false, message: "Invalid token" });

    const user = await userModel
      .findOne({ _id: decode.userID })
      .select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!user?.isVerified)
      return res
        .status(401)
        .json({ success: false, message: "User is not verified" });

    req.user = user._id;

    next();
  } catch (error) {
    console.log("Error in user protection route.", error);
    res
      .status(500)
      .json({ success: false, message: "Error in user protection route." });
  }
};
