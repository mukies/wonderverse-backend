const transportationModel = require("../models/transportation.m");

exports.addTransportation = async (req, res) => {
  const {
    tourID,
    transportationType,
    costPerPerson,
    transportationDesc,
    contactNumber,
    contactEmail,
    estimatedDuration,
    from,
    capacity,
  } = req.body;

  //todo validation
  try {
    const newTransportation = new transportationModel({
      tourID,
      transportationType,
      costPerPerson,
      transportationDesc,
      contactNumber,
      estimatedDuration,
      from,
      contactEmail,
      capacity,
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
    estimatedDuration,
    contactEmail,
    from,
    capacity,
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
        transportationDesc,
        contactNumber,
        estimatedDuration,
        contactEmail,
        from,
        capacity,
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

exports.fetchTransportationByTourIdAndLocation = async (req, res) => {
  const { tourID } = req.params;
  const { from } = req.body;

  if (!tourID || !from)
    return res.status(400).json({
      success: false,
      message: "Tour id and customer location is required.",
    });

  try {
    const transportations = await transportationModel.find({ from, tourID });

    res.status(200).json({ success: true, transportations });
  } catch (error) {
    console.log("Error while fetching transportation.");
    res.status(500).json({
      message: "Error while fetching transportation.",
      success: false,
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
