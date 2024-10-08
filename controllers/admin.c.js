const bcrypt = require("bcryptjs");
const {
  generateTokenAndSetCookie,
} = require("../helper/generateTokenAndSendCookie");
const tourModel = require("../models/tour.m");
const { sendEmail } = require("../nodemailer/sendEmail");
const adminModel = require("../models/admin.m");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");

exports.registerAdmin = async (req, res) => {
  const { fullName, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const isAdminExist = await adminModel.findOne({ isVerified: true });

    if (isAdminExist) {
      return res
        .status(401)
        .json({ success: false, message: "Admin already register." });
    }

    const isEmailExist = await adminModel.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const OTPExpiryDate = new Date();
    OTPExpiryDate.setHours(OTPExpiryDate.getHours() + 1);

    let adminID;

    if (isEmailExist && !isEmailExist.isVerified) {
      isEmailExist.fullName = fullName;
      isEmailExist.password = hashedPassword;
      isEmailExist.OTP = OTP;
      isEmailExist.OTPExpiryDate = OTPExpiryDate;

      await isEmailExist.save();
      adminID = isEmailExist._id;
    } else {
      const newAdmin = new adminModel({
        fullName,
        email,
        password: hashedPassword,
        OTP,
        OTPExpiryDate,
      });
      await newAdmin.save();
      adminID = newAdmin._id;
    }

    //todo: send verification code into the email.
    await sendEmail(fullName, OTP, email);

    res.status(201).json({
      success: true,
      message:
        "Admin created successfully. Verification code has been sent to the email address.",
      adminID,
    });
  } catch (error) {
    console.log("Error while registering admin.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while registering admin." });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const isRegister = await adminModel.findOne({ email });

    if (!isRegister || !isRegister?.isVerified)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

    //check password

    const isMatch = await bcrypt.compare(password, isRegister.password);

    if (!isMatch)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

    const adminData = {
      _id: isRegister._id,
      email: isRegister.email,
      fullName: isRegister.fullName,
      isVerified: isRegister.isVerified,
    };

    generateTokenAndSetCookie(isRegister._id, res, "ajwt");

    res
      .status(200)
      .json({ success: true, message: "Login successful", adminData });
  } catch (error) {
    console.log("Error while admin login.");
    res
      .status(500)
      .json({ success: false, message: "Error while admin login." });
  }
};

exports.verifyAdmin = async (req, res) => {
  const { OTP } = req.body;
  const { uid } = req.params;

  if (!OTP)
    return res
      .status(400)
      .json({ success: false, message: "OTP code required" });

  if (!mongoose.Types.ObjectId.isValid(uid))
    return res
      .status(401)
      .json({ success: false, message: "Invalid object id" });

  try {
    const admin = await adminModel.findById(uid);

    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin account not found." });

    if (OTP !== admin.OTP)
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP code." });

    if (admin.OTPExpiryDate < new Date())
      return res.status(401).json({
        success: false,
        message: "OTP code has been expired. Register again.",
      });

    admin.isVerified = true;
    await admin.save();

    const adminData = {
      _id: admin._id,
      email: admin.email,
      fullName: admin.fullName,
      isVerified: admin.isVerified,
    };

    generateTokenAndSetCookie(admin._id, res);

    res
      .status(200)
      .json({ success: true, message: "Admin has been verified", adminData });
  } catch (error) {
    console.log("Error while verifying admin.");
    res
      .status(500)
      .json({ success: false, message: "Error in admin verification." });
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    res.cookie("ajwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ success: true, message: "Logout successfull" });
  } catch (error) {
    console.log("Error while logout", error);
    res.status(500).json({ success: false, message: "Error while logout." });
  }
};

exports.loggedInData = tryCatchWrapper(async (req, res) => {
  const userData = await adminModel.findById(req.admin).select("-password");

  if (!userData)
    return res
      .status(404)
      .json({ success: false, message: "Admin account not found" });

  const responseData = {
    name: userData.fullName,
    email: userData.email,
    photo: userData.photo,
  };

  res.json({ success: true, data: responseData });
});
