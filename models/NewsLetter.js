import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },  isActive: { type: Boolean, default: true },
});

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
