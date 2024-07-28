exports.invalidObj = (res) => {
  res.status(401).json({ success: false, message: "Invalid object id" });
};
