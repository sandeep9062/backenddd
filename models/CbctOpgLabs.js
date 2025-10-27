import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentCharges: Number,
    isActive: { type: Boolean, default: true },
    img: { type: String, required: true },
    state: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },

    website: { type: String },
    offers: { type: [String], required: true },
    whatsapp: { type: String },
    mapUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Cbct&OpgLabs", clinicSchema);
