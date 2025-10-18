import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  clinicId: {
    type: String,
    required: true,
  },
  clinicName: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  patientPhone: {
    type: String,
    required: true,
    trim: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  appointmentSlot: {
    type: String,
    required: true,
  },
  clinicAddress: {
    type: String,
    required: false,
  },
  clinicCity: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Appointment', appointmentSchema);
