const { v2 } = require("cloudinary");

exports.generateLink = async (url) => {
  const res = await v2.uploader.upload(url);
  return res.secure_url;
};
