const transportationModel = require("../models/transportation.m");

exports.addTransportation = async (req, res) => {
  const {
    tourID,
    transportationType,
    costPerPerson,
    transportationDesc,
    contactNumber,
    duration,
  } = req.body;

  //todo validation
  try {
    const newTransportation = new transportationModel({
      tourID,
      transportationType,
      costPerPerson,
      transportationDesc: transportationDesc || "",
      contactNumber,
      duration,
    });

    await newTransportation.save();

    res.status(201).json({
      success: true,
      message: "New transportation has been created.",
      newTransportation,
    });
  } catch (error) {
    console.log("Error while adding Transportation.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while adding Transportation." });
  }
};

exports.editTransportationDetails = async (req, res) => {
  const {
    tourID,
    transportationType,
    costPerPerson,
    transportationDesc,
    contactNumber,
    duration,
  } = req.body;

  const { id } = req.params;

  //todo validation
  try {
    const updatedTransportation = await transportationModel.findByIdAndUpdate(
      id,
      {
        tourID,
        transportationType,
        costPerPerson,
        transportationDesc: transportationDesc || "",
        contactNumber,
        duration,
      }
    );

    await updatedTransportation.save();

    res.status(201).json({
      success: true,
      message: "Transportation details has been updated.",
      updatedTransportation,
    });
  } catch (error) {
    console.log("Error while updating Transportation details.", error);
    res.status(500).json({
      success: false,
      message: "Error while updating Transportation details.",
    });
  }
};

exports.fetchAllTransportation = async (req, res) => {
  try {
    const transportations = await transportationModel.find();

    res.status(200).json({ success: true, transportations });
  } catch (error) {
    console.log("Error while fetching Transportations.", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching Transportations.",
    });
  }
};

exports.fetchTransportationByTourId = async (req, res) => {
  const { tourID } = req.params;
  try {
    const transportations = await transportationModel.find({ tourID });

    res.status(200).json({ success: true, transportations });
  } catch (error) {
    console.log("Error while fetching Transportations.", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching Transportations.",
    });
  }
};

exports.deleteTransportation = async (req, res) => {
  const { id } = req.params;
  try {
    await transportationModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Transportation deleted successfully." });
  } catch (error) {
    console.log("Error while deleting Transportation.", error);
    res.status(500).json({
      success: false,
      message: "Error while deleting Transportation.",
    });
  }
};
