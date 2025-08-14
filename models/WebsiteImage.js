import mongoose from "mongoose";

const WebsiteImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // descriptive name (e.g., "Homepage Banner")
    url: { type: String, required: true }, // Cloudinary URL
    alt: { type: String, default: "" }, // alt text for accessibility
    type: {
      type: String,
      enum: ["logo", "banner", "background", "icon", "other"],
      default: "other",
    },
    order: { type: Number, default: 0, unique: true }, // for sorting
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.WebsiteImage ||
  mongoose.model("WebsiteImage", WebsiteImageSchema);
