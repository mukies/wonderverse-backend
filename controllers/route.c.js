const { validationResult } = require("express-validator");
const routeModel = require("../models/route.m");
const vehicleRegistrationModel = require("../models/vehicleRegistration.m");

exports.createRoute = async (req, res) => {
  const { destination, from, costPerPerson, isAvailable } = req.body;
  const { vehicleID: vehicle } = req.params; //vehicle id

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const isAlreadyExist = await routeModel.findOne({
      vehicle,
      destination,
      from,
    });

    if (isAlreadyExist)
      return res
        .status(409)
        .json({ success: false, message: "Route already exist." });

    const newRoute = new routeModel({
      createdBy: req.partner,
      vehicle,
      destination,
      from,
      costPerPerson,
      isAvailable,
    });

    await newRoute.save();

    res
      .status(201)
      .json({ success: true, message: "New route has been created" });
  } catch (error) {
    console.log("Error while creating vehicle route.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating vehicle route." });
  }
};
exports.editRoute = async (req, res) => {
  const { destination, from, costPerPerson, isAvailable } = req.body;
  const { vehicleID, routeID } = req.params;

  try {
    const isExist = await routeModel.findOne({
      destination,
      from,
      vehicle: vehicleID,
      _id: { $ne: routeID },
    });

    if (isExist)
      return res
        .status(403)
        .json({ success: false, message: "Route already exist" });

    const updatedRoute = await routeModel.findByIdAndUpdate(
      routeID,
      {
        destination,
        from,
        costPerPerson,
        isAvailable,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Route has been updated",
      updatedRoute,
    });
  } catch (error) {
    console.log("Error while updating route", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating route" });
  }
};

exports.toggleAvailable = async (req, res) => {
  const { id } = req.params;
  try {
    const route = await routeModel.findById(id);

    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });

    if (route.isAvailable) {
      route.isAvailable = false;
    } else {
      route.isAvailable = true;
    }
    await route.save();

    res.json({
      success: true,
      message: "Route availablity status has been changed.",
    });
  } catch (error) {
    console.log("Error while changing availablity status.");
    res.status(500).json({
      success: false,
      message: "Error while changing availablity status.",
    });
  }
};

exports.deleteRoute = async (req, res) => {
  const { id } = req.params; //route id

  try {
    const route = await routeModel.findById(id);

    if (route.createdBy.toString() !== req.partner.toString())
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized action" });

    await routeModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Route has been deleted" });
  } catch (error) {
    console.log("Error while deleting route", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting route" });
  }
};

exports.fetchPersonalRoutes = async (req, res) => {
  try {
    const routes = await routeModel
      .find({
        createdBy: req.partner,
      })
      .populate("destination", "placeName mainImage slug location")
      .populate("vehicle");

    res.json({ success: true, routes });
  } catch (error) {
    console.log("Error while fetching available routes", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching available routes",
    });
  }
};

exports.fetchRoutesInTour = async (req, res) => {
  const { tourID, placeName } = req.params;
  const { type = "all" } = req.query;

  if (
    type !== "all" &&
    type !== "taxi" &&
    type !== "bus" &&
    type !== "hiace" &&
    type !== "scorpio"
  )
    return res
      .status(400)
      .json({ success: false, message: "Invalid filter type" });
  try {
    let routes = await routeModel
      .find({
        from: placeName,
        destination: tourID,
        isAvailable: true,
      })
      .populate("destination", "placeName mainImage slug location")
      .populate("vehicle");

    routes = routes.filter((route) => route.vehicle.status == "approved");

    if (type !== "all") {
      routes = routes.filter((route) => route.vehicle.vehicleType == type);
    }

    res.json({ success: true, routes });
  } catch (error) {
    console.log("Error while fetching available routes", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching available routes",
    });
  }
};

exports.fetchSingleRouteData = async (req, res) => {
  const { id } = req.params;
  try {
    const route = await routeModel
      .findById(id)
      .populate("vehicle")
      .populate("destination", "placeName mainImage slug location avgRating");

    res.json({ success: true, route });
  } catch (error) {
    console.log("Error while fetching route data", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching route data",
    });
  }
};
