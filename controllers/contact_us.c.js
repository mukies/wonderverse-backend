const contactUsModel = require("../models/contact_us.m");

exports.submit_message = async (req, res) => {
  const { fullName, email, subject, message } = req.body;

  if (!fullName || !email || !subject || !message)
    return res.status(400).json({
      success: false,
      message: "Please provide required information.",
    });

  try {
    const newMessage = new contactUsModel({
      fullName,
      email,
      subject,
      message,
    });

    await newMessage.save();

    res
      .status(201)
      .json({ success: true, message: "Message has been submitted." });
  } catch (error) {
    console.log("Error while submitting contact us message.");
    res.status(500).json({
      success: false,
      message: "Error while submitting contact us message.",
    });
  }
};

exports.all_messages = async (req, res) => {
  try {
    const messages = await contactUsModel.find();

    res.json({ success: true, messages });
  } catch (error) {
    console.log("Error while fetching contact us messages.");
    res.status(500).json({
      success: false,
      message: "Error while fetching contact us messages.",
    });
  }
};

exports.delete_message = async (req, res) => {
  const { id } = req.params;
  try {
    await contactUsModel.findByIdAndDelete(id);

    res
      .status(201)
      .json({ success: true, message: "Message has been deleted." });
  } catch (error) {
    console.log("Error while deleting contact us message.");
    res.status(500).json({
      success: false,
      message: "Error while deleting contact us message.",
    });
  }
};
