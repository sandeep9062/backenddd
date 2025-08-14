import WebsiteImage from "../models/WebsiteImage.js";

// @desc   Upload a new image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, alt, type, order } = req.body;

    const newImage = await WebsiteImage.create({
      name,
      url: req.file.path,
      alt,
      type,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all images
export const getImages = async (req, res) => {
  try {
    const images = await WebsiteImage.find().sort({ order: 1 });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update image details
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (req.file && req.file.path) {
      updatedData.url = req.file.path;
    }

    const updatedImage = await WebsiteImage.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedImage) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    res.json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await WebsiteImage.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
