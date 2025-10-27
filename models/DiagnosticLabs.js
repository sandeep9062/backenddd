import mongoose from "mongoose";

const diagnosticLabSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    img: { type: String, required: true },
    state: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    appointmentCharges: Number,
    offers: { type: [String], required: true },
    website: { type: String },
    whatsapp: { type: String },
    mapUrl: { type: String },
    appointmentCharges: Number,
  },
  { timestamps: true }
);

export default mongoose.model("DiagnosticLabs", diagnosticLabSchema);
