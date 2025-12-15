import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [{ type: String }],
    videos: [{ type: String }],
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    problems: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    website: { type: String },
    whatsapp: { type: String },
    mapUrl: { type: String },
    isActive: { type: Boolean, default: true },
    phoneNumbers: [{ type: String }],
    subscribedPlans: [{
      planName: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      status: { type: String, enum: ['past', 'present'], required: true },
      offerDetails: { type: String }
    }],
    offers: [{ type: mongoose.Schema.Types.Mixed }],
    numberOfDoctors: { type: Number, default: 0 },
    socialMediaLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String }
    },
    areasServed: [{ type: String }],
    mainDoctorContact: {
      name: { type: String },
      email: { type: String },
      phoneNumber: { type: String }
    },
    bestTimeToConnect: [{ type: String }],
    // Legacy fields for backward compatibility
    description: { type: String },
    specialities: [{ type: String }],
    appointmentCharges: { type: Number },
    noOfDoctors: { type: Number },
    instagramId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Clinic", clinicSchema);
