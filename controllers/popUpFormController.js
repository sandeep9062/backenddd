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

export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await PopUpForm.find();
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await PopUpForm.findByIdAndDelete(id);
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
