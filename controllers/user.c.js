const bcrypt = require("bcryptjs");
const userModel = require("../models/user.m");
const {
  generateTokenAndSetCookie,
} = require("../helper/generateTokenAndSendCookie");
const tourModel = require("../models/tour.m");
const { sendEmail } = require("../nodemailer/sendEmail");
const { validationResult } = require("express-validator");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, country } = req.body;
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

    let userID;

    if (isEmailExist && !isEmailExist.isVerified) {
      isEmailExist.firstName = firstName;
      isEmailExist.lastName = lastName;
      isEmailExist.country = country;
      isEmailExist.photo = photo;
      isEmailExist.password = hashedPassword;
      isEmailExist.OTP = OTP;
      isEmailExist.OTPExpiryDate = OTPExpiryDate;

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
      });
      await newUser.save();
      userID = newUser._id;
    }

    //todo: send verification code into the email.
    await sendEmail(firstName, OTP, email);

    res.status(201).json({
      success: true,
      message:
        "User created successfully.  Verification code has been sent to the email address.",
      userID,
    });
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
    return res.status(400).json({ success: false, message: errors.array() });
  }

  try {
    const isRegister = await userModel.findOne({ email });

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

    const userData = {
      _id: isRegister._id,
      photo: isRegister.photo,
      email: isRegister.email,
      firstName: isRegister.firstName,
      lastName: isRegister.lastName,
    };

    const token = generateTokenAndSetCookie(isRegister._id, res);

    res
      .status(200)
      .json({ success: true, message: "Login successful", userData, token });
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
      .json({ success: false, message: "OTP code and userID required" });

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
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ success: true, message: "Logout successfull" });
  } catch (error) {
    console.log("Error while logout", error);
    res.status(500).json({ success: false, message: "Error while logout." });
  }
};

exports.tourRating = async (req, res) => {
  const { rating, comment } = req.body;
  const { tourID } = req.params;

  if (!rating || !comment)
    return res.status(400).json({
      success: false,
      message: "Rating and message is required to submit a review.",
    });

  try {
    const review = {
      userID: req.user._id,
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

      tour.avgRating = Number(totelRating) / tour.reviews.length;
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
  const userID = req.user._id;

  try {
    const user = await userModel.findById(userID).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
    };

    res.status(200).json({ success: true, message: "User found", userData });
  } catch (error) {
    console.log("Error while fetching user data.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching user data." });
  }
};
