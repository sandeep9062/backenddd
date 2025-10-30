import mongoose from "mongoose";

const fixMyTeethSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    selectedType: { type: String, enum: ["adult", "kid"], required: true },

    name: { type: String, required: true },
    email: { type: String, required: true },
    teethProblems: { type: Object, required: true },
    otherProblemText: { type: String, required: true },
    selectedState: { type: String, required: true },
    photos: [{ type: String }],

status: {
      type: String,
      enum: ["Pending", "Seen", "Report Generated"],
      default: "Pending",
    },



  },
  { timestamps: true }
);

export default mongoose.models.FixMyTeeth || mongoose.model("FixMyTeeth", fixMyTeethSchema);
