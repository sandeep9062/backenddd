import ContactUS from "../models/Contact_US.js";
import sendEmail from "../utils/sendEmail.js";
import Notification from "../models/Notification.js";

// ✅ Create Contact Message
export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ✅ Save contact to DB
    const contact = new ContactUS({ name, email, message });
    await contact.save();

    // Create a notification
    const notification = new Notification({
      text: `New contact from ${name}`,
    });
    await notification.save();

    // Send email notification
    await sendEmail({
      to: process.env.OWNER_RECEIVER_EMAIL,
      subject: "New Support Request from Fix My Teeth Page",
      html: `
        <h2>New Support Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully", contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Messages
export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactUS.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Message
export const getContactById = async (req, res) => {
  try {
    const contact = await ContactUS.findById(req.params.id);
    if (!contact)
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Message Status
export const updateContactStatus = async (req, res) => {
  try {
    const contact = await ContactUS.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact)
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Message
export const deleteContact = async (req, res) => {
  try {
    const contact = await ContactUS.findByIdAndDelete(req.params.id);
    if (!contact)
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
