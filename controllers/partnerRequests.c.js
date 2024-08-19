const { default: mongoose } = require("mongoose");
const { get, set } = require("../config/cache_setup");
const { invalidObj } = require("../helper/objectIdHendler");
const { paginate } = require("../helper/pagination");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const vehicleRegistrationModel = require("../models/vehicleRegistration.m");
const guideRegistrationModel = require("../models/guideRegistration.m");
const { clearCacheByPrefix } = require("../helper/clearCache");
const hotelRegistrationModel = require("../models/hoteRegistration.m");

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
  await clearCacheByPrefix("total");
  await clearCacheByPrefix("registeredVehicle");

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
  await clearCacheByPrefix("total");

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
  await clearCacheByPrefix("total");
  await clearCacheByPrefix("registeredGuide");

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
  await clearCacheByPrefix("total");

  res.status(200).json({ success: true, message: "Guide has been rejected." });
});

//hotel requests
exports.allHotelRequest = tryCatchWrapper(async (req, res) => {
  const { limit, page, skip } = paginate(req);

  let hotelRequests = await get(`hotelRequests:${page}`);
  if (hotelRequests) return res.json({ success: true, data: hotelRequests });

  hotelRequests = await hotelRegistrationModel
    .find({ status: "pending" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("requestedBy", "photo firstName lastName gender email")
    .populate("tour", "placeName mainImage slug location");

  const totalItems = await hotelRegistrationModel.countDocuments({
    status: "pending",
  });
  const totalPages = Math.ceil(totalItems / limit);

  const data = {
    hotelRequests,
    totalItems,
    totalPages,
    page,
  };
  await set(`hotelRequests:${page}`, data, 3600);
  res.json({ success: true, data });
});

exports.approveHotel = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const hotel = await hotelRegistrationModel.findById(id);

  if (!hotel)
    return res
      .status(404)
      .json({ success: false, message: "Hotel not found." });

  hotel.status = "approved";

  await hotel.save();
  await clearCacheByPrefix("hotelRequest");
  await clearCacheByPrefix("total");
  await clearCacheByPrefix("registeredHotel");

  res.status(200).json({ success: true, message: "Hotel has been approved." });
});

exports.rejectHotel = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  const { rejectionMessage } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  if (!rejectionMessage)
    return res
      .status(400)
      .json({ success: false, message: "Rejection message is required" });

  const hotel = await hotelRegistrationModel.findById(id);

  if (!hotel)
    return res
      .status(404)
      .json({ success: false, message: "Hotel not found." });

  hotel.status = "rejected";
  hotel.rejectionMessage = rejectionMessage;

  await hotel.save();
  await clearCacheByPrefix("hotelRequest");
  await clearCacheByPrefix("total");

  res.status(200).json({ success: true, message: "Hotel has been rejected." });
});

//total
exports.totalRequest = tryCatchWrapper(async (req, res) => {
  let total = await get(`total`);
  if (total) return res.json({ success: true, data: total });

  const vehicleRequests = await vehicleRegistrationModel.countDocuments({
    status: "pending",
  });
  const guideRequests = await guideRegistrationModel.countDocuments({
    status: "pending",
  });
  const hotelRequests = await hotelRegistrationModel.countDocuments({
    status: "pending",
  });

  total = {
    vehicleRequests,
    hotelRequests,
    guideRequests,
  };

  await set(`total`, total, 3600);
  res.json({ success: true, data: total });
});
