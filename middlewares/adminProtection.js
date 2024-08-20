const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin.m");

exports.adminProtection = async (req, res, next) => {
  try {
    const token = req.cookies["ajwt"];

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });

    const decode = jwt.verify(token, process.env.JWT_KEY);
    if (!decode)
      return res.status(401).json({ success: false, message: "Invalid token" });

    const admin = await adminModel
      .findOne({ _id: decode.userID })
      .select("-password");

    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin account not found" });

    if (!admin?.isVerified)
      return res.status(401).json({
        success: false,
        message: "Admin account is not verified",
      });

    req.admin = admin._id.toString();
    next();
  } catch (error) {
    console.log("Error in admin protection route.", error);
    res
      .status(500)
      .json({ success: false, message: "Error in admin protection route." });
  }
};
