import express from 'express';
import { registerPatient, loginPatient, googleLogin, forgotPassword, resetPassword } from '../controllers/patientController.js';

const router = express.Router();

// Patient Registration Route
router.post('/register', registerPatient);

// Patient Login Route
router.post('/login', loginPatient);

// Google Login Route
router.post('/google-login', googleLogin);

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password/:token', resetPassword);

export default router;
