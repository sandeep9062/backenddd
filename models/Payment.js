// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // optional if users are not logged in
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    planName: { type: String, required: true },
    planType: { type: String },
    billingCycle: {
      type: String,
      enum: ["month", "year"],
      default: "month",
    },

    // Razorpay details
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    // Optional metadata
    email: String,
    phone: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
