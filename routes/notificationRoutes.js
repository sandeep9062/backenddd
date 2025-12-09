import express from 'express';
const router = express.Router();
import { getNotifications, createNotification } from '../controllers/notificationController.js';
import { protect, checkAdmin } from '../middlewares/authMiddleware.js';

router.route('/').get(protect,checkAdmin, getNotifications).post(protect,checkAdmin, createNotification);

export default router;
