// models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dentist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Appointment", appointmentSchema);
