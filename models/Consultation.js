import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    // 🔹 Link to the dentist being booked
    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DentistProfile",
      required: true,
    },

    // 🔹 Link to the user (patient) who booked
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // can be optional if not logged in
    },

    // 🔹 Patient information (for both guests and logged-in users)
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    patientEmail: {
      type: String,
      required: [true, "Patient email is required"],
      trim: true,
      lowercase: true,
    },
    patientPhone: {
      type: String,
      trim: true,
    },

    // 🔹 Consultation details
    selectedDate: {
      type: Date,
      required: [true, "Consultation date is required"],
    },
    selectedSlot: {
      type: String,
      required: [true, "Time slot is required"],
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔹 Dentist charge and payment details
    consultationFee: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },

    // 🔹 Appointment status
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    // 🔹 Notes from dentist/admin
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent model overwrite in dev
export default mongoose.models.Consultation ||
  mongoose.model("Consultation", consultationSchema);
