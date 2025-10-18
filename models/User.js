// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  role: {
    type: String,
    enum: [
      "patient",
      "admin",
      "dentist",
      "pharma&brand",
      "cbct&opgcenters",
      "diagnosticlabs",
    ],
    default: "patient",
    required: true,
  },
  googleId: { type: String },
  profile: mongoose.Schema.Types.Mixed,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
