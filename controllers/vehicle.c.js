const { validationResult } = require("express-validator");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const routeModel = require("../models/route.m");
const vehicleRegistrationModel = require("../models/vehicleRegistration.m");

exports.addVehicle = async (req, res) => {
  const {
    vehicleName,
    vehicleNumberPlate,
    vehicleCapacity,
    driverDetails,
    vehicleType,
  } = req.body;

  let { vehiclePhoto, featureImages, blueBookPhotos } = req.body;
  //todo: validation

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  if (!vehiclePhoto.startsWith("http")) {
    vehiclePhoto = await generateLink(vehiclePhoto);
  }

  blueBookPhotos = blueBookPhotos.map(async (photo) => {
    if (!photo.startsWith("http")) {
      return await generateLink(photo);
    }
    return photo;
  });

  featureImages = featureImages.map(async (photo) => {
    if (!photo.startsWith("http")) {
      return await generateLink(photo);
    }
    return photo;
  });

  if (!driverDetails.driverLicencePhoto.startsWith("http")) {
    driverDetails.driverLicencePhoto = await generateLink(
      driverDetails.driverLicencePhoto
    );
  }

  try {
    const newVehicle = new vehicleRegistrationModel({
      vehicleName,
      vehicleNumberPlate,
      vehicleCapacity,
      driverDetails,
      vehiclePhoto,
      blueBookPhotos,
      requestedBy: req.partner,
      vehicleType,
    });

    await newVehicle.save();
    res.json({
      success: true,
      message: "Vehicle submitted to review.",
      newVehicle,
    });
  } catch (error) {
    console.log("Error while adding vehicle", error);
    res
      .status(500)
      .json({ success: false, message: "Error while adding vehicle" });
  }
};

exports.deleteVehicle = async (req, res) => {
  const { id } = req.params; //vehicle id
  try {
    const vehicle = await vehicleRegistrationModel.findById(id);

    if (vehicle.requestedBy.toString() !== req.partner.toString())
      return res
        .status(401)
        .json({ success: false, message: "Unauthorize action." });

    await routeModel.deleteMany({ vehicle: id });
    await vehicleRegistrationModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Vehicle has been deleted" });
  } catch (error) {
    console.log("Error while deleting vehicle", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting vehicle" });
  }
};
exports.fetch_Personal_Vehicles = async (req, res) => {
  try {
    const vehicles = await vehicleRegistrationModel.find({
      requestedBy: req.partner,
    });

    res.json({ success: true, vehicles });
  } catch (error) {
    console.log("Error while fetching all vehicles", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching all vehicles",
    });
  }
};

exports.fetchSingleVehicleData = async (req, res) => {
  const { id } = req.params; //vehicle id
  try {
    const vehicleData = await vehicleRegistrationModel
      .findById(id)
      .populate("requestedBy", "photo firstName lastName partnerType");

    res.json({ success: true, vehicleData });
  } catch (error) {
    console.log("Error while fetching vehicle data", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching vehicle data" });
  }
};
exports.updateVehicleDetails = async (req, res) => {
  const { vehicleID } = req.params;
  const {
    vehicleName,
    vehicleNumberPlate,
    vehicleCapacity,
    driverDetails,
    vehicleType,
  } = req.body;

  let { vehiclePhoto, featureImages, blueBookPhotos } = req.body;
  //todo: validation

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  if (!vehiclePhoto.startsWith("http")) {
    vehiclePhoto = await generateLink(vehiclePhoto);
  }

  blueBookPhotos = blueBookPhotos.map(async (photo) => {
    if (!photo.startsWith("http")) {
      return await generateLink(photo);
    }
    return photo;
  });

  featureImages = featureImages.map(async (photo) => {
    if (!photo.startsWith("http")) {
      return await generateLink(photo);
    }
    return photo;
  });

  if (!driverDetails.driverLicencePhoto.startsWith("http")) {
    driverDetails.driverLicencePhoto = await generateLink(
      driverDetails.driverLicencePhoto
    );
  }

  try {
    const updatedVehicle = await vehicleRegistrationModel.findByIdAndUpdate(
      vehicleID,
      {
        vehicleName,
        vehicleNumberPlate,
        vehicleCapacity,
        driverDetails,
        vehiclePhoto,
        blueBookPhotos,
        vehicleType,
        status: "pending",
        featureImages,
      },
      { new: true }
    );
    res.json({
      success: true,
      message: "Vehicle submitted for review",
      updatedVehicle,
    });
  } catch (error) {
    console.log("Error while updating vehicle details", error);
    res.status(500).json({
      success: false,
      message: "Error while updating vehicle details",
    });
  }
};

//admin actions
exports.approveVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await vehicleRegistrationModel.findById(id);

    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle data not found." });

    vehicle.status = "approved";

    await vehicle.save();

    res
      .status(200)
      .json({ success: true, message: "Vehicle has been approved.", vehicle });
  } catch (error) {
    console.log("Error while approving vehicle", error);
    res
      .status(500)
      .json({ success: false, message: "Error while approving vehicle" });
  }
};
exports.rejectVehicle = async (req, res) => {
  const { id } = req.params;
  const { rejectionMessage } = req.body;

  try {
    const vehicle = await vehicleRegistrationModel.findById(id);

    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle data not found." });

    vehicle.status = "rejected";
    vehicle.rejectionMessage = rejectionMessage;

    await vehicle.save();

    res
      .status(200)
      .json({ success: true, message: "Vehicle has been rejected.", vehicle });
  } catch (error) {
    console.log("Error while rejecting vehicle", error);
    res
      .status(500)
      .json({ success: false, message: "Error while rejecting vehicle" });
  }
};
