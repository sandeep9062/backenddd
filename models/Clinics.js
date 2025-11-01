import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [{ type: String }],
    description: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    offers: { type: [String], required: true },
    problems: { type: [String], required: true },
    specialities: { type: [String], required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    website: { type: String },
    whatsapp: { type: String },
    instagramId: { type: String },
    mapUrl: { type: String },
    appointmentCharges: Number,
    noOfDoctors: Number,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Clinic", clinicSchema);
