const bcrypt = require("bcryptjs");
const userModel = require("../models/user.m");
const {
  generateTokenAndSetCookie,
} = require("../helper/generateTokenAndSendCookie");
const tourModel = require("../models/tour.m");
const {
  sendEmail,
  sendResetPasswordEmail,
} = require("../nodemailer/sendEmail");
const { validationResult } = require("express-validator");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const partnerModel = require("../models/partner.m");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, country, gender } = req.body;
  let { photo } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    if (photo && !photo.startsWith("http")) {
      photo = await generateLink(photo);
    }
    const isEmailExist = await userModel.findOne({ email });

    if (isEmailExist && isEmailExist.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Email already exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const OTPExpiryDate = new Date();
    OTPExpiryDate.setHours(OTPExpiryDate.getHours() + 1);

    const isVerifiedEmail = await partnerModel.findOne({
      isVerified: true,
      email,
    });

    let userID;

    if (isEmailExist && !isEmailExist.isVerified) {
      isEmailExist.firstName = firstName;
      isEmailExist.lastName = lastName;
      isEmailExist.country = country;
      isEmailExist.photo = photo;
      isEmailExist.password = hashedPassword;
      isEmailExist.OTP = OTP;
      isEmailExist.gender = gender;
      isEmailExist.OTPExpiryDate = OTPExpiryDate;
      if (isVerifiedEmail) {
        isEmailExist.isVerified = true;
      }
      await isEmailExist.save();
      userID = isEmailExist._id;
    } else {
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        OTP,
        OTPExpiryDate,
        photo,
        country,
        gender,
      });

      if (isVerifiedEmail) {
        newUser.isVerified = true;
      }
      await newUser.save();
      userID = newUser._id;
    }

    if (!isVerifiedEmail) {
      //todo: send verification code into the email.
      await sendEmail(firstName, OTP, email);
      res.status(201).json({
        success: true,
        message: "Verification code has been sent to the email address.",
        userID,
      });
    } else {
      res.status(201).json({
        success: true,
        message: "User Registered.",
      });
    }
  } catch (error) {
    console.log("Error while registering user.");
    res
      .status(500)
      .json({ success: false, message: "Error while registering user." });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const isRegister = await userModel.findOne({ email });

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

    const userData = {
      _id: isRegister._id,
      photo: isRegister.photo,
      email: isRegister.email,
      firstName: isRegister.firstName,
      lastName: isRegister.lastName,
      passportNumber: isRegister.passportNumber,
      country: isRegister.country,
      gender: isRegister.gender,
      passportExpiryDate: isRegister.passportExpiryDate,
      arrivalDate: isRegister.arrivalDate,
      departureDate: isRegister.departureDate,
    };

    await generateTokenAndSetCookie(isRegister._id, res);

    res
      .status(200)
      .json({ success: true, message: "Login successful", userData });
  } catch (error) {
    console.log("Error while login.");
    res.status(500).json({ success: false, message: "Error while login." });
  }
};

exports.verifyUser = async (req, res) => {
  const { OTP } = req.body;
  const { uid } = req.params;

  if (!OTP)
    return res
      .status(400)
      .json({ success: false, message: "OTP code required" });

  try {
    const user = await userModel.findById(uid);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    if (OTP !== user.OTP)
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP code." });

    if (user.OTPExpiryDate < new Date())
      return res.status(401).json({
        success: false,
        message: "OTP code has been expired. Register again.",
      });

    user.isVerified = true;

    await user.save();

    const userData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // generateTokenAndSetCookie(user._id, res);

    res.status(200).json({ success: true, message: "User has been verified" });
  } catch (error) {
    console.log("Error while verifying user.");
    res
      .status(500)
      .json({ success: false, message: "Error in user verification." });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({ success: true, message: "Logout successfull" });
  } catch (error) {
    console.log("Error while logout", error);
    res.status(500).json({ success: false, message: "Error while logout." });
  }
};

exports.tourRating = async (req, res) => {
  const { rating, comment } = req.body;
  const { tourID } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const review = {
      userID: req.user,
      rating,
      comment,
    };

    const tour = await tourModel.findById(tourID);

    if (!tour)
      return res.status(404).json({
        success: false,
        message: "Tour not found. Invalid tour ID.",
      });

    tour.reviews.push(review);

    let totelRating = 0;

    if (tour.reviews.length > 0) {
      tour.reviews.map((item) => {
        totelRating += Number(item.rating);
      });
      const avg = Number(totelRating) / tour.reviews.length;
      tour.avgRating = Math.round(avg * 2) / 2;
    }
    await tour.save();

    res
      .status(200)
      .json({ success: true, message: "Review has been submitted." });
  } catch (error) {
    console.log("Error while rating a tour", error);
    res
      .status(500)
      .json({ success: false, message: "Error while rating a tour." });
  }
};

exports.fetchUser = async (req, res) => {
  const userID = req.user;

  try {
    if (!userID)
      return res
        .status(401)
        .json({ success: false, message: "Please Login first." });

    const user = await userModel.findById(userID).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo,
      _id: user._id,
      passportNumber: user.passportNumber,
      country: user.country,
      gender: user.gender,
      passportExpiryDate: user.passportExpiryDate,
      arrivalDate: user.arrivalDate,
      departureDate: user.departureDate,
    };

    res.status(200).json({ success: true, message: "User found", userData });
  } catch (error) {
    console.log("Error while fetching user data.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching user data." });
  }
};

exports.changeUserDetails = tryCatchWrapper(async (req, res) => {
  const { firstName, lastName, gender, country } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const user = await userModel.findById(req.user);

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const updatedProfile = await userModel.findByIdAndUpdate(
    req.user,
    {
      firstName,
      lastName,
      gender,
      country,
    },
    { new: true }
  );

  res.json({
    success: true,
    message: "Profile details updated",
    updatedProfile: {
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      gender: updatedProfile.gender,
      country: updatedProfile.country,
    },
  });
});

exports.changePassword = tryCatchWrapper(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const user = await userModel.findById(req.user);

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  //check old password is matched or not

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch)
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedProfile = await userModel.findByIdAndUpdate(
    req.user,
    {
      password: hashedPassword,
    },
    { new: true }
  );

  res.json({
    success: true,
    message: "Password has been changed",
  });
});

exports.changeProfilePhoto = tryCatchWrapper(async (req, res) => {
  let { photo } = req.body;

  if (!photo)
    return res
      .status(400)
      .json({ success: false, message: "Photo is required." });

  if (!photo.startsWith("http")) {
    photo = await generateLink(photo);
  }
  const user = await userModel.findById(req.user);

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const updatedProfile = await userModel.findByIdAndUpdate(
    req.user,
    {
      photo,
    },
    { new: true }
  );

  res.json({
    success: true,
    message: "Profile Picture changed",
    updatedProfile: { photo: updatedProfile.photo },
  });
});

exports.changePassportDetails = tryCatchWrapper(async (req, res) => {
  const { passportNumber, passportExpiryDate, arrivalDate, departureDate } =
    req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const user = await userModel.findById(req.user);

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const updatedProfile = await userModel.findByIdAndUpdate(
    req.user,
    {
      passportNumber,
      passportExpiryDate,
      arrivalDate,
      departureDate,
    },
    { new: true }
  );

  res.json({
    success: true,
    message: "Passport details updated",
    updatedProfile,
  });
});

exports.requestForgetPassCode = tryCatchWrapper(async (req, res) => {
  const { email } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const user = await userModel.findOne({ email });

  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "Email does not exist." });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 5);
  user.isRecoveryCodeUsed = false;
  user.passwordRecoveryCode = code;
  user.passwordRecoveryCodeExpiryDate = expiryDate;

  await user.save();
  await sendResetPasswordEmail(code, email);

  res.json({ success: true, data: user._id });
});

exports.verifyResetCode = tryCatchWrapper(async (req, res) => {
  const { code } = req.query;
  const { id } = req.params;

  if (!code)
    return res
      .status(400)
      .json({ success: false, message: "Recovery code is required" });

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const user = await userModel.findById(id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  if (user.isRecoveryCodeUsed)
    return res
      .status(400)
      .json({ success: false, message: "Recovery code is already used." });

  if (user.passwordRecoveryCode !== code)
    return res
      .status(400)
      .json({ success: false, message: "Invalid recovery code." });

  if (user.passwordRecoveryCodeExpiryDate < new Date())
    return res.status(400).json({
      success: false,
      message: "Recovery code expired.",
    });

  res.json({ success: true, data: user._id });
});

exports.resetPassword = tryCatchWrapper(async (req, res) => {
  const { newPassword } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  const user = await userModel.findById(id);

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.isRecoveryCodeUsed = true;

  await user.save();
  res.json({ success: true, message: "Password has been reset." });
});
