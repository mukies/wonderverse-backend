const { validationResult } = require("express-validator");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const routeModel = require("../models/route.m");
const vehicleRegistrationModel = require("../models/vehicleRegistration.m");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { paginate } = require("../helper/pagination");
const { get, set } = require("../config/cache_setup");
const { clearCacheByPrefix } = require("../helper/clearCache");

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
  try {
    if (!vehiclePhoto.startsWith("http")) {
      vehiclePhoto = await generateLink(vehiclePhoto);
    }

    blueBookPhotos = await Promise.all(
      blueBookPhotos.map(async (photo) => {
        // console.log("image", photo);

        if (!photo.startsWith("http")) {
          return await generateLink(photo);
        }
        return photo;
      })
    );

    featureImages = await Promise.all(
      featureImages.map(async (photo) => {
        if (!photo.startsWith("http")) {
          return await generateLink(photo);
        }
        return photo;
      })
    );

    if (!driverDetails.driverLicencePhoto.startsWith("http")) {
      driverDetails.driverLicencePhoto = await generateLink(
        driverDetails.driverLicencePhoto
      );
    }

    const newVehicle = new vehicleRegistrationModel({
      vehicleName,
      vehicleNumberPlate,
      vehicleCapacity,
      driverDetails,
      vehiclePhoto,
      blueBookPhotos,
      requestedBy: req.partner,
      vehicleType,
      featureImages,
    });

    await newVehicle.save();
    await clearCacheByPrefix("vehicleReq");
    await clearCacheByPrefix("total");
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
    await clearCacheByPrefix("vehicleReq");
    await clearCacheByPrefix("total");

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
  try {
    if (!vehiclePhoto.startsWith("http")) {
      vehiclePhoto = await generateLink(vehiclePhoto);
    }

    blueBookPhotos = await Promise.all(
      blueBookPhotos.map(async (photo) => {
        if (!photo.startsWith("http")) {
          return await generateLink(photo);
        }
        return photo;
      })
    );

    featureImages = await Promise.all(
      featureImages.map(async (photo) => {
        if (!photo.startsWith("http")) {
          return await generateLink(photo);
        }
        return photo;
      })
    );

    if (!driverDetails.driverLicencePhoto.startsWith("http")) {
      driverDetails.driverLicencePhoto = await generateLink(
        driverDetails.driverLicencePhoto
      );
    }

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
    await clearCacheByPrefix("vehicleReq");
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

exports.allApprovedVehicle = tryCatchWrapper(async (req, res) => {
  const { limit, page, skip } = paginate(req);

  let vehicles = await get(`registeredVehicle:${page}`);

  if (vehicles) return res.json({ success: true, data: vehicles });

  vehicles = await vehicleRegistrationModel
    .find({ status: "approved" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("requestedBy", "photo firstName lastName gender email");

  const totalItems = await vehicleRegistrationModel.countDocuments({
    status: "approved",
  });
  const totalPages = Math.ceil(totalItems / limit);

  const data = {
    vehicles,
    totalItems,
    totalPages,
    page,
  };

  await set(`registeredVehicle:${page}`, data, 3600);
  res.json({ success: true, data });
});
