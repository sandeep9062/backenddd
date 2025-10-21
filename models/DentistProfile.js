// models/DentistProfile.js
import mongoose from "mongoose";

const dentistProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one profile per dentist
  },
  specialization: [String],
  problems: [String],
  states: [String],
  clinicName: String,
  experienceYears: Number,
  certifications: [String],
  clinicAddress: String,
  about: String,
  image: String,  isActive: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  gradCollege: { type: String, required: true },
  gradYear: { type: String, required: true },
  gradReg: { type: String, required: true },
  postCollege: { type: String },
  postYear: { type: String },
  postSpec: { type: String },
  otherQual: { type: String },
  hasClinic: { type: Boolean, default: false },
  agreeDisclaimer: { type: Boolean, required: true },
});

export default mongoose.model("DentistProfile", dentistProfileSchema);
