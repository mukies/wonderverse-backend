const { v2 } = require("cloudinary");

exports.generateLink = async (url) => {
  const res = await v2.uploader.upload(url, {
    format: "webp",
    transformation: [{ quality: "auto:best" }],
  });
  return res.secure_url;
};
