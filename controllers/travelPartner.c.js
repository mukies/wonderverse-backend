const routeModel = require("../models/route.m");

exports.addRoute = async (req, res) => {
  const { destination, from, costPerPerson } = req.body;
  const { id: vehicle } = req.params;
  //todo validation
  try {
    const newRoute = new routeModel({
      destination,
      from,
      costPerPerson,
      vehicle,
      createdBy: req.partner,
    });

    await newRoute.save();

    res.status(201).json({
      success: true,
      message: "New route has been created.",
      newRoute,
    });
  } catch (error) {
    console.log("Error while creating route.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating route." });
  }
};

exports.editRoute = async (req, res) => {
  const { destination, from, costPerPerson } = req.body;
  const { id } = req.params; //route id

  //todo validation
  try {
    const updateRoute = await routeModel.findByIdAndUpdate(id, {
      destination,
      from,
      costPerPerson,
    });

    await updateRoute.save();

    res.status(200).json({
      success: true,
      message: "Route has been updated.",
      updateRoute,
    });
  } catch (error) {
    console.log("Error while updating route.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating route." });
  }
};
