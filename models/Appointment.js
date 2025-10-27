import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    clinicName: {
      type: String,
      required: true,
    },
    clinicSpecialities: {
      type: [String],
      required: true,
    },
    clinicLocation: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    clinicPhone: {
      type: String,
    },
    clinicWebsite: {
      type: String,
    },
    clinicOffers: {
      type: String,
    },
    clinicCharges: {
      type: Number,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
