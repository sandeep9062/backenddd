// models/Plan.js
import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    monthly: { type: Number },
    yearly: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 }, // optional (for yearly savings)
  },
  { _id: false } // prevent auto _id for subdocument
);

const planSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pricing: {
      type: pricingSchema,
      required: true,
    },
    duration: {
      type: String,
      default: "1 year", // can still use for display or default
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    highlight: {
      type: Boolean,
      default: false, // highlight popular plans
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
