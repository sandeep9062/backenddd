// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("Subscription", subscriptionSchema);
