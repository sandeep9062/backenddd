import Appointment from '../models/appointmentModel.js';

export const createAppointment = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const {
      clinicId,
      clinicName,
      patientName,
      patientPhone,
      appointmentDate,
      appointmentSlot,
      clinicAddress,
      clinicCity,
    } = req.body;

    console.log("appointment data",req.body);

    if (
      !clinicId ||
      !clinicName ||
      !patientName ||
      !patientPhone ||
      !appointmentDate ||
      !appointmentSlot
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAppointment = new Appointment({
      clinicId,
      clinicName,
      patientName,
      patientPhone,
      appointmentDate,
      appointmentSlot,
      clinicAddress,
      clinicCity,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: newAppointment,
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
