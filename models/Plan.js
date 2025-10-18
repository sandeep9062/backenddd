// models/Plan.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, default: "1 year" },
  features: [{ type: String }],
  highlight: { type: Boolean, default: false },
});

export default mongoose.model("Plan", planSchema);
