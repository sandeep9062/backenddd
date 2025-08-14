// models/SiteSettings.js
import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      required: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, "Invalid website URL"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    mainOffice: {
      type: String,
      required: true,
      trim: true,
    },
    branchOffice: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo1: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?\d{7,15}$/, "Invalid contact number"],
    },
    contactNo2: {
      type: String,
      trim: true,
      match: [/^\+?\d{7,15}$/, "Invalid contact number"],
    },
    GSTNO: {
      type: String,
      uppercase: true,
      trim: true,
    },
    accountName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    IFSCcode: {
      type: String,
      uppercase: true,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    bannerUrl: {
      type: String,
      default: "",
      trim: true,
    },
    favicon: {
      type: String,
      default: "",
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, "Invalid Facebook URL"],
    },
    instagramUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, "Invalid Instagram URL"],
    },
    twitterUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, "Invalid Twitter URL"],
    },
    youtubeUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, "Invalid YouTube URL"],
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", siteSettingsSchema);
