import Appointment from "../models/Appointment.js";
import sendEmail from "../utils/sendEmail.js";
import Clinic from "../models/Clinics.js";
import CbctOpgLabs from "../models/CbctOpgLabs.js";
import DiagnosticLabs from "../models/DiagnosticLabs.js";

// 📌 Create Appointment
export const createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();

    // Send email to the service provider
    const { serviceType, clinicId } = req.body;
    let service;
    if (serviceType === "clinic") {
      service = await Clinic.findById(clinicId).populate("user", "email");
    } else if (serviceType === "cbct-opg-lab") {
      service = await CbctOpgLabs.findById(clinicId).populate("user", "email");
    } else if (serviceType === "blood-test") {
      service = await DiagnosticLabs.findById(clinicId).populate(
        "user",
        "email"
      );
    }

    if (service && service.user && service.user.email) {
      const emailData = {
        to: service.user.email,
        subject: "New Appointment Booking",
        html: `
          <h1>New Appointment Booking</h1>
          <p><strong>Name:</strong> ${appointment.fullName}</p>
          <p><strong>Mobile:</strong> ${appointment.mobileNumber}</p>
          <p><strong>Date:</strong> ${appointment.appointmentDate.toDateString()}</p>
          <p><strong>Time:</strong> ${appointment.timeSlot}</p>
        `,
      };
      await sendEmail(emailData);
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📌 Get All Appointments (Admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get Appointments by Logged-in User (Patient)
export const getMyAppointment = async (req, res) => {
  try {
    const mobileNumber = req.user.phone.slice(-10);

    const appointments = await Appointment.find({
      mobileNumber: { $regex: `${mobileNumber}$`, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get Appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update Appointment (status, etc.)
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📌 Delete Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });

    res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get Appointments by User (Patient)
export const getAppointmentsByUser = async (req, res) => {
  try {
    console.log("hello");
    console.log(req.user, "checlclclc");

    const mobileNumber = req.params.mobileNumber.slice(-10);
    const appointments = await Appointment.find({
      mobileNumber: { $regex: `${mobileNumber}$`, $options: "i" },
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
