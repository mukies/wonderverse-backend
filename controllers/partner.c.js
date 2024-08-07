const bcrypt = require("bcryptjs");

const {
  generateTokenAndSetCookie,
} = require("../helper/generateTokenAndSendCookie");

const {
  sendEmail,
  sendResetPasswordEmail,
} = require("../nodemailer/sendEmail");
const { validationResult } = require("express-validator");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const partnerModel = require("../models/partner.m");
const userModel = require("../models/user.m");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");

exports.registerPartner = async (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;
  let { photo } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  if (photo && !photo.startsWith("http")) {
    photo = await generateLink(photo);
  }

  try {
    const isEmailExist = await partnerModel.findOne({ email });

    if (isEmailExist && isEmailExist.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Email already exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const OTPExpiryDate = new Date();
    OTPExpiryDate.setHours(OTPExpiryDate.getHours() + 1);

    const isVerifiedEmail = await userModel.findOne({
      isVerified: true,
      email,
    });

    let partnerID;

    if (isEmailExist && !isEmailExist.isVerified) {
      isEmailExist.firstName = firstName;
      isEmailExist.lastName = lastName;
      isEmailExist.photo = photo;
      isEmailExist.gender = gender;
      isEmailExist.password = hashedPassword;
      isEmailExist.OTP = OTP;
      isEmailExist.OTPExpiryDate = OTPExpiryDate;

      if (isVerifiedEmail) {
        isEmailExist.isVerified = true;
      }

      await isEmailExist.save();
      partnerID = isEmailExist._id;
    } else {
      const newPartner = new partnerModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        OTP,
        OTPExpiryDate,
        photo,
        gender,
      });

      if (isVerifiedEmail) {
        newPartner.isVerified = true;
      }
      await newPartner.save();
      partnerID = newPartner._id;
    }

    if (!isVerifiedEmail) {
      //todo: send verification code into the email.
      await sendEmail(firstName, OTP, email);

      res.status(201).json({
        success: true,
        message: "Verification code has been sent to the email address.",
        partnerID,
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Partner Registered.",
      });
    }
  } catch (error) {
    console.log("Error while registering a partner", error);
    res
      .status(500)
      .json({ success: false, message: "Error while registering a partner" });
  }
};
exports.loginPartner = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const isRegister = await partnerModel.findOne({ email });

    if (!isRegister || !isRegister?.isVerified)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

    //check password

    const isMatch = bcrypt.compare(password, isRegister.password);

    if (!isMatch)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

    const partnerData = {
      _id: isRegister._id,
      photo: isRegister.photo,
      email: isRegister.email,
      firstName: isRegister.firstName,
      lastName: isRegister.lastName,
    };

    await generateTokenAndSetCookie(isRegister._id, res);

    res
      .status(200)
      .json({ success: true, message: "Login successful", partnerData });
  } catch (error) {
    console.log("Error while login a partner", error);
    res
      .status(500)
      .json({ success: false, message: "Error while login a partner" });
  }
};
exports.verifyPartner = async (req, res) => {
  const { OTP } = req.body;
  const { uid } = req.params;

  if (!OTP)
    return res
      .status(400)
      .json({ success: false, message: "OTP code required" });

  try {
    const partner = await partnerModel.findById(uid);

    if (!partner)
      return res
        .status(404)
        .json({ success: false, message: "Partner not found." });

    if (OTP !== partner.OTP)
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP code." });

    if (partner.OTPExpiryDate < new Date())
      return res.status(401).json({
        success: false,
        message: "OTP code has been expired. Register again.",
      });

    partner.isVerified = true;

    await partner.save();

    const partnerData = {
      _id: partner._id,
      email: partner.email,
      firstName: partner.firstName,
      lastName: partner.lastName,
    };

    // generateTokenAndSetCookie(partner._id, res);

    res
      .status(200)
      .json({ success: true, message: "Partner has been verified" });
  } catch (error) {
    console.log("Error while verifying partner account", error);
    res.status(500).json({
      success: false,
      message: "Error while verifying partner account",
    });
  }
};
exports.logoutPartner = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({ success: true, message: "Logout successfull" });
  } catch (error) {
    console.log("Error while logout", error);
    res.status(500).json({ success: false, message: "Error while logout" });
  }
};
exports.loggedInPartner = async (req, res) => {
  const partnerID = req.partner;

  try {
    if (!partnerID)
      return res
        .status(401)
        .json({ success: false, message: "Please Login first." });

    const partner = await partnerModel.findById(partnerID).select("-password");

    if (!partner)
      return res
        .status(404)
        .json({ success: false, message: "Partner data not found." });

    const partnerData = {
      firstName: partner.firstName,
      lastName: partner.lastName,
      email: partner.email,
      isVerified: partner.isVerified,
      photo: partner.photo,
      _id: partner._id,
    };

    res
      .status(200)
      .json({ success: true, message: "Partner found", partnerData });
  } catch (error) {
    console.log("Error while fetching partner data", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching partner data" });
  }
};

exports.requestForgetPassCodePartner = tryCatchWrapper(async (req, res) => {
  const { email } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const partner = await partnerModel.findOne({ email });

  if (!partner)
    return res
      .status(404)
      .json({ success: false, message: "Email does not exist." });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 5);
  partner.isRecoveryCodeUsed = false;
  partner.passwordRecoveryCode = code;
  partner.passwordRecoveryCodeExpiryDate = expiryDate;

  await partner.save();
  await sendResetPasswordEmail(code, email);

  res.json({ success: true, data: partner._id });
});

exports.verifyResetCodePartner = tryCatchWrapper(async (req, res) => {
  const { code } = req.query;
  const { id } = req.params;

  if (!code)
    return res
      .status(400)
      .json({ success: false, message: "Recovery code is required" });

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const partner = await partnerModel.findById(id);
  if (!partner)
    return res
      .status(404)
      .json({ success: false, message: "Partner not found" });

  if (partner.isRecoveryCodeUsed)
    return res
      .status(400)
      .json({ success: false, message: "Recovery code is already used." });

  if (partner.passwordRecoveryCode !== code)
    return res
      .status(400)
      .json({ success: false, message: "Invalid recovery code." });

  if (partner.passwordRecoveryCodeExpiryDate < new Date())
    return res.status(400).json({
      success: false,
      message: "Recovery code expired.",
    });

  res.json({ success: true, data: partner._id });
});

exports.resetPasswordPartner = tryCatchWrapper(async (req, res) => {
  const { newPassword } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const partner = await partnerModel.findById(id);

  if (!partner)
    return res
      .status(404)
      .json({ success: false, message: "Partner not found" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  partner.password = hashedPassword;
  partner.isRecoveryCodeUsed = true;

  await partner.save();
  res.json({ success: true, message: "Password has been reset." });
});
