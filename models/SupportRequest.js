import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    whoHelpedResolve: {
      type: String,
      required: false,
      trim: true,
    },
    actionTaken: {
      type: String,
      required: false,
      trim: true,
    },
    customerSatisfaction: {
      type: String,
      enum: ["Yes", "No", "N/A"],
      default: "N/A",
      required: false,
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportRequest", supportRequestSchema);
