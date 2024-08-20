const adminModel = require("../models/admin.m");
const partnerModel = require("../models/partner.m");
const jwt = require("jsonwebtoken");

exports.adminAndPartnerGuard = async (req, res, next) => {
  try {
    const adminToken = req.cookies["ajwt"];
    const partnerToken = req.cookies["pjwt"];

    // console.log("admin", adminToken);

    if (!adminToken && !partnerToken)
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });

    if (adminToken && partnerToken)
      return res
        .status(401)
        .json({ success: false, message: "Multiple token encountered." });

    const decode = jwt.verify(partnerToken || adminToken, process.env.JWT_KEY);

    if (!decode)
      return res.status(401).json({ success: false, message: "Invalid token" });

    if (partnerToken) {
      const partner = await partnerModel.findOne({
        _id: decode.userID,
        isVerified: true,
      });

      if (!partner)
        return res
          .status(404)
          .json({ success: false, message: "Partner account not found" });

      req.partner = partner._id.toString();
      next();
    } else {
      const admin = await adminModel.findOne({
        _id: decode.userID,
        isVerified: true,
      });

      if (!admin)
        return res
          .status(404)
          .json({ success: false, message: "Admin account not found" });

      next();
    }
  } catch (error) {
    console.log("Error in admin and partner protection route.", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
