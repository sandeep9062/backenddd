import SupportRequest from "../models/SupportRequest.js";
import Notification from "../models/Notification.js";

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

    // Create a notification
    await Notification.create({
      text: `New support request from ${req.body.name}`,
    });

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

export const getAllSupportRequests = async (req, res) => {
  try {
    const supportRequests = await SupportRequest.find();
    res.status(200).json(supportRequests);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve support requests.",
      error: error.message,
    });
  }
};

export const updateSupportRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide a status.",
      });
    }

    const updatedSupportRequest = await SupportRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSupportRequest) {
      return res.status(404).json({
        success: false,
        message: "Support request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Support request status updated successfully.",
      data: updatedSupportRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update support request status.",
      error: error.message,
    });
  }
};

export const deleteSupportRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSupportRequest = await SupportRequest.findByIdAndDelete(id);

    if (!deletedSupportRequest) {
      return res.status(404).json({
        success: false,
        message: "Support request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Support request deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete support request.",
      error: error.message,
    });
  }
};
