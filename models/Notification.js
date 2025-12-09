import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Notification', notificationSchema);
