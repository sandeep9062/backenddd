import PopUpForm from "../models/PopUpForm.js";
import cloudinary from "cloudinary";



export const submitEnquiry = async (req, res) => {
  try {
    const {
      fullName,
      country,
      email,
      contactNumber,
      preferredContactMethod,
      treatmentRequired,
      description,
      preferredCity,
      travelDate,
      budgetRange,
      comments,
    } = req.body;

    if (!fullName || !email || !contactNumber || !treatmentRequired) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    let fileUrl = null;

    if (req.file) {
      const uploaded = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "dental-enquiries",
      });
      fileUrl = uploaded.secure_url;
    }

    const enquiry = new PopUpForm({
      fullName,
      country,
      email,
      contactNumber,
      preferredContactMethod,
      treatmentRequired,
      description,
      preferredCity,
      travelDate,
      budgetRange,
      comments,
      fileUrl,
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "popupform submitted successfully!",
      data: enquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit popupform.",
      error: error.message,
    });
  }
};
