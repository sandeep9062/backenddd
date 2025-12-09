import Notification from "../models/Notification.js"

// @desc    Get all notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ time: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Create a new notification
// @route   POST /api/v1/notifications
// @access  Private
export const createNotification = async (req, res, next) => {
  try {
    const { text } = req.body;
    const notification = await Notification.create({ text });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
