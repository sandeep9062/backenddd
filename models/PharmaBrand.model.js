import mongoose from 'mongoose';

const pharmaBrandSchema = new mongoose.Schema({
  brandName: { type: String, required: true },
  OwnerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  alternativeNumber: { type: String },
  websiteURL: { type: String, required: true },
}, { timestamps: true });

const PharmaBrand = mongoose.model('PharmaBrand', pharmaBrandSchema);
export default PharmaBrand;
