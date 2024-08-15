const { default: mongoose } = require("mongoose");
const { get, set } = require("../config/cache_setup");
const { invalidObj } = require("../helper/objectIdHendler");
const { paginate } = require("../helper/pagination");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const vehicleRegistrationModel = require("../models/vehicleRegistration.m");
const guideRegistrationModel = require("../models/guideRegistration.m");
const { clearCacheByPrefix } = require("../helper/clearCache");

//vehicles requests
exports.allVehicleRequest = tryCatchWrapper(async (req, res) => {
  const { limit, page, skip } = paginate(req);

  let vehicleRequests = await get(`vehicleReq:${page}`);
  if (vehicleRequests)
    return res.json({ success: true, data: vehicleRequests });

  vehicleRequests = await vehicleRegistrationModel
    .find({ status: "pending" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("requestedBy", "photo firstName lastName gender email");

  const totalItems = await vehicleRegistrationModel.countDocuments({
    status: "pending",
  });
  const totalPages = Math.ceil(totalItems / limit);

  const data = {
    vehicleRequests,
    totalItems,
    totalPages,
    page,
  };
  await set(`vehicleReq:${page}`, data, 3600);
  res.json({ success: true, data });
});

exports.singleVehicleRequestDetails = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  let vehicleRequests = await get(`vehicleReq:${id}`);
  if (vehicleRequests)
    return res.json({ success: true, data: vehicleRequests });

  vehicleRequests = await vehicleRegistrationModel
    .findOne({ status: "pending", _id: id })
    .populate("requestedBy", "photo firstName lastName gender email");

  if (!vehicleRequests)
    return res
      .status(404)
      .json({ success: false, message: "Vehicle not found" });

  await set(`vehicleReq:${id}`, vehicleRequests, 3600);
  res.json({ success: true, data: vehicleRequests });
});

exports.approveVehicle = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const vehicle = await vehicleRegistrationModel.findById(id);

  if (!vehicle)
    return res
      .status(404)
      .json({ success: false, message: "Vehicle data not found." });

  vehicle.status = "approved";

  await vehicle.save();
  await clearCacheByPrefix("vehicleReq");

  res
    .status(200)
    .json({ success: true, message: "Vehicle has been approved." });
});

exports.rejectVehicle = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  const { rejectionMessage } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  if (!rejectionMessage)
    return res
      .status(400)
      .json({ success: false, message: "Rejection message is required" });

  const vehicle = await vehicleRegistrationModel.findById(id);

  if (!vehicle)
    return res
      .status(404)
      .json({ success: false, message: "Vehicle data not found." });

  vehicle.status = "rejected";
  vehicle.rejectionMessage = rejectionMessage;

  await vehicle.save();
  await clearCacheByPrefix("vehicleReq");

  res
    .status(200)
    .json({ success: true, message: "Vehicle has been rejected." });
});

// guide requests

exports.allGuideRequest = tryCatchWrapper(async (req, res) => {
  const { limit, page, skip } = paginate(req);

  let guideRequests = await get(`guideRequests:${page}`);
  if (guideRequests) return res.json({ success: true, data: guideRequests });

  guideRequests = await guideRegistrationModel
    .find({ status: "pending" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("requestedBy", "photo firstName lastName gender email")
    .populate("guidingDestinations", "placeName mainImage slug location");

  const totalItems = await guideRegistrationModel.countDocuments({
    status: "pending",
  });
  const totalPages = Math.ceil(totalItems / limit);

  const data = {
    guideRequests,
    totalItems,
    totalPages,
    page,
  };
  await set(`guideRequests:${page}`, data, 3600);
  res.json({ success: true, data });
});

exports.singleGuideRequestDetails = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  let guideRequests = await get(`guideRequests:${id}`);
  if (guideRequests) return res.json({ success: true, data: guideRequests });

  guideRequests = await guideRegistrationModel
    .findOne({ status: "pending", _id: id })
    .populate("requestedBy", "photo firstName lastName gender email")
    .populate("guidingDestinations", "placeName mainImage slug location");

  if (!guideRequests)
    return res.status(404).json({ success: false, message: "Guide not found" });

  await set(`guideRequests:${id}`, guideRequests, 3600);
  res.json({ success: true, data: guideRequests });
});

exports.approveGuide = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const guide = await guideRegistrationModel.findById(id);

  if (!guide)
    return res
      .status(404)
      .json({ success: false, message: "Guide data not found." });

  guide.status = "approved";

  await guide.save();
  await clearCacheByPrefix("guideRequests");
  res.status(200).json({ success: true, message: "Guide has been approved." });
});

exports.rejectGuide = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  const { rejectionMessage } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  if (!rejectionMessage)
    return res
      .status(400)
      .json({ success: false, message: "Rejection message is required" });

  const guide = await guideRegistrationModel.findById(id);

  if (!guide)
    return res
      .status(404)
      .json({ success: false, message: "Guide data not found." });

  guide.status = "rejected";
  guide.rejectionMessage = rejectionMessage;

  await guide.save();
  await clearCacheByPrefix("guideRequests");

  res.status(200).json({ success: true, message: "Guide has been rejected." });
});

//hotel requests
