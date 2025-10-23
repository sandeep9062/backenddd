import mongoose from "mongoose";

const popUpFormSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    preferredContactMethod: { type: String, required: true },
    treatmentRequired: { type: String, required: true },
    description: { type: String },
    preferredCity: { type: String, required: true },
    travelDate: { type: Date, required: true },
    budgetRange: { type: String },
    comments: { type: String },
    fileUrl: { type: String }, // store uploaded file URL
  },
  { timestamps: true }
);

const PopUpForm = mongoose.model("PopUpForm", popUpFormSchema);

export default PopUpForm;
