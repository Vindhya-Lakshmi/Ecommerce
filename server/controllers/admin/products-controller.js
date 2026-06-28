const { imageUploadUtil } = require("../../helpers/cloudinary");

const handleImageUpload = async (req, res) => {
  try {
    const base64 = Buffer.from(req.file.buffer).toString("base64");

    const url = "data:" + req.file.mimetype + "base64," + base64;

    const result = await imageUploadUtil(url);

    res.status(200).json({
      success: true,
      result: uploadResult,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error occurred while uploading image",
    });
  }
};

module.exports = { handleImageUpload };