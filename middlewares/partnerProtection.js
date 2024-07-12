const jwt = require("jsonwebtoken");
const partnerModel = require("../models/partner.m");

exports.partnerProtection = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });

    const decode = jwt.verify(token, process.env.JWT_KEY);
    if (!decode)
      return res.status(401).json({ success: false, message: "Invalid token" });

    const partner = await partnerModel
      .findOne({ _id: decode?.userID })
      .select("-password");

    if (!partner)
      return res
        .status(404)
        .json({ success: false, message: "Partner account not found" });

    if (!partner?.isVerified)
      return res
        .status(401)
        .json({ success: false, message: "Partner account is not verified" });

    req.partner = partner._id;

    next();
  } catch (error) {
    console.log("Error in partner protection route.", error);
    res.status(500).json({
      success: false,
      message: "Error in partner protection route.",
    });
  }
};
