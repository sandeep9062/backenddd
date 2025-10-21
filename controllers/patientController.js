import User from "../models/User.js";

export const getAllPatients = async (req, res) => {
  try {
    // ✅ Fetch only users whose role = "patient"
    const patients = await User.find({ role: "patient" })
      .select("-password") // optional: exclude password field
      .sort({ createdAt: -1 }); // optional: sort by newest first

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};
