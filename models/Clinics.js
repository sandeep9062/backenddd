import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: { type: String },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    problems: { type: [String], required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    bookUrl: { type: String, default: "#" },
    website: { type: String },
    whatsapp: { type: String },
    mapUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Clinic", clinicSchema);
