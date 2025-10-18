// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
});

export default mongoose.model("Subscription", subscriptionSchema);
