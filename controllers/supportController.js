import SupportRequest from "../models/SupportRequest.js";

export const createSupportRequest = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const newSupportRequest = new SupportRequest({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newSupportRequest.save();

    res.status(201).json({
      success: true,
      message: "Support request submitted successfully.",
      data: newSupportRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit support request.",
      error: error.message,
    });
  }
};
