import Consultation from "../models/Consultation.js";
import DentistProfile from "../models/DentistProfile.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";

// ✅ Add a new consultation (booking)
export const addConsultation = async (req, res) => {
  try {
    const {
      dentist,
      patientName,
      patientEmail,
      patientPhone,
      selectedDate,
      selectedSlot,
      message,
      consultationFee,
    } = req.body;

    if (!dentist || !patientName || !patientEmail || !selectedDate || !selectedSlot) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Optional: check if dentist exists
    const dentistExists = await DentistProfile.findById(dentist);
    if (!dentistExists) {
      return res.status(404).json({ message: "Dentist not found." });
    }

    const newConsultation = await Consultation.create({
      dentist,
      user: req.user ? req.user._id : null, // if user is logged in
      patientName,
      patientEmail,
      patientPhone,
      selectedDate,
      selectedSlot,
      message,
      consultationFee,
    });

    // Send notification to patient
    try {
      const patientMessage = `
        <h3>Consultation Booked Successfully</h3>
        <p>Hello ${patientName},</p>
        <p>Your consultation with the dentist has been successfully booked. Here are the details:</p>
        <ul>
          <li><strong>Date:</strong> ${new Date(
            selectedDate
          ).toLocaleDateString()}</li>
          <li><strong>Slot:</strong> ${selectedSlot}</li>
        </ul>
        <p>You will be contacted by the clinic shortly.</p>
      `;
      await sendEmail({
        to: patientEmail,
        subject: "Consultation Booked Successfully",
        html: patientMessage,
      });
    } catch (emailError) {
      console.error("Error sending patient notification email:", emailError);
    }

    // Send notification to dentist
    try {
      const dentistUser = await User.findById(dentistExists.user);
      if (dentistUser && dentistUser.email) {
        const dentistMessage = `
          <h3>New Consultation Booked</h3>
          <p>Hello Dr. ${dentistUser.name},</p>
          <p>A new consultation has been booked with you. Here are the details:</p>
          <ul>
            <li><strong>Patient Name:</strong> ${patientName}</li>
            <li><strong>Patient Email:</strong> ${patientEmail}</li>
            <li><strong>Patient Phone:</strong> ${patientPhone}</li>
            <li><strong>Date:</strong> ${new Date(
              selectedDate
            ).toLocaleDateString()}</li>
            <li><strong>Slot:</strong> ${selectedSlot}</li>
          </ul>
        `;
        await sendEmail({
          to: dentistUser.email,
          subject: "New Consultation Booked",
          html: dentistMessage,
        });
      }
    } catch (emailError) {
      console.error("Error sending dentist notification email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Consultation booked successfully.",
      consultation: newConsultation,
    });
  } catch (error) {
    console.error("Error adding consultation:", error);
    res.status(500).json({ message: "Server error while booking consultation." });
  }
};

// ✅ Get all consultations (Admin only)
export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate({
        path: "dentist",
        select: "user clinicName specialization",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, consultations });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ message: "Server error while fetching consultations." });
  }
};

// ✅ Get consultations by logged-in user
export const getConsultationsByUser = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientEmail: req.user.email })
      .populate({
        path: "dentist",
        select: "user clinicName specialization",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, consultations });
  } catch (error) {
    console.error("Error fetching user consultations:", error);
    res.status(500).json({ message: "Server error while fetching consultations." });
  }
};

// ✅ Get consultation by ID
export const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate({
        path: "dentist",
        select: "user clinicName specialization",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate("user", "name email");

    if (!consultation)
      return res.status(404).json({ message: "Consultation not found." });

    res.json({ success: true, consultation });
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({ message: "Server error while fetching consultation." });
  }
};

// ✅ Update consultation (status or details)
export const updateConsultation = async (req, res) => {
  try {
    const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Consultation not found." });

    res.json({ success: true, message: "Consultation updated successfully.", updated });
  } catch (error) {
    console.error("Error updating consultation:", error);
    res.status(500).json({ message: "Server error while updating consultation." });
  }
};

// ✅ Delete consultation
export const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation)
      return res.status(404).json({ message: "Consultation not found." });

    await consultation.deleteOne();
    res.json({ success: true, message: "Consultation deleted successfully." });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    res.status(500).json({ message: "Server error while deleting consultation." });
  }
};

// ✅ Change status (Confirm / Complete / Cancel)
export const updateConsultationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ message: "Status is required." });

    const updated = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, message: "Status updated.", updated });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error while updating status." });
  }
};

// ✅ Get consultations by logged-in dentist
export const getConsultationsByDentist = async (req, res) => {
  try {
    // Find the dentist profile for the logged-in user
    const dentistProfile = await DentistProfile.findOne({ user: req.user._id });

    if (!dentistProfile) {
      return res.status(404).json({ message: "Dentist profile not found." });
    }

    // Find consultations for this dentist
    const consultations = await Consultation.find({ dentist: dentistProfile._id })
      .populate("user", "name email") // This would be the patient who booked, if they were logged in
      .sort({ createdAt: -1 });

    res.json({ success: true, data: consultations });
  } catch (error) {
    console.error("Error fetching dentist consultations:", error);
    res.status(500).json({ message: "Server error while fetching consultations." });
  }
};
