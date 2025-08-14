import Uniform from "../models/Uniform.js";

// ✅ Create Uniform
export const createUniform = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    const { title, description, features, uniformType, uniformSubtype, uniformCode } = req.body;

    const uniform = new Uniform({
      title,
      description,
      features: features ? JSON.parse(features) : [], // Expecting features as JSON array from frontend
      uniformType,
      uniformSubtype,
      uniformCode,
      image: req.file.path, // Cloudinary URL
    });

    await uniform.save();
    res.status(201).json(uniform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Uniforms
export const getUniforms = async (req, res) => {
  try {
    const uniforms = await Uniform.find().sort({ createdAt: -1 });
    res.json(uniforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Uniform
export const getUniform = async (req, res) => {
  try {
    const { id } = req.params;
    const uniform = await Uniform.findById(id);
    if (!uniform) return res.status(404).json({ message: "Uniform not found" });
    res.json(uniform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Uniform
export const updateUniform = async (req, res) => {
  try {
    const { id } = req.params;
    const uniform = await Uniform.findById(id);
    if (!uniform) return res.status(404).json({ message: "Uniform not found" });

    const { title, description, features, uniformType, uniformSubtype, uniformCode } = req.body;

    if (title !== undefined) uniform.title = title;
    if (description !== undefined) uniform.description = description;
    if (features !== undefined) uniform.features = JSON.parse(features);
    if (uniformType !== undefined) uniform.uniformType = uniformType;
    if (uniformSubtype !== undefined) uniform.uniformSubtype = uniformSubtype;
    if (uniformCode !== undefined) uniform.uniformCode = uniformCode;
    if (req.file) uniform.image = req.file.path; // Replace image if new file uploaded

    await uniform.save();
    res.json(uniform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Uniform
export const deleteUniform = async (req, res) => {
  try {
    const { id } = req.params;
    const uniform = await Uniform.findByIdAndDelete(id);
    if (!uniform) return res.status(404).json({ message: "Uniform not found" });
    res.json({ message: "Uniform deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
