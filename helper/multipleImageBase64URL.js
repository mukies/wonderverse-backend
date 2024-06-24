const { v2 } = require("cloudinary");
exports.multipleImagesBase64URL = async (imageFile, res) => {
  try {
    if (!imageFile)
      return res
        .status(400)
        .json({ success: false, message: "Image file not found." });
    const imageURLs = imageFile.map(async (image) => {
      const base64Image = await image.buffer.toString("base64");
      const base64Url = `data:${image.mimetype};base64,${base64Image}`;

      const response = await v2.uploader.upload(base64Url);
      return response.secure_url;
    });

    return Promise.all(imageURLs);
  } catch (error) {
    console.log("Error while uploading image", error);
    res
      .status(500)
      .json({ success: false, message: "Error while uploading image" });
  }
};
