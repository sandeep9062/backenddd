import Appointment from "../models/Appointment.js";

// 📌 Create Appointment
export const createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
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

// 📌 Get Appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ success: false, message: "Appointment not found" });

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Update Appointment (status, etc.)
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!appointment)
      return res.status(404).json({ success: false, message: "Appointment not found" });

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
      return res.status(404).json({ success: false, message: "Appointment not found" });

    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
