import patientModel from '../models/patientModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Patient Registration
export const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if patient already exists
    const existingPatient = await patientModel.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: 'Patient already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new patient
    const newPatient = new patientModel({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newPatient.save();

    res.status(201).json({ success: true, message: 'Patient registered successfully', patient: newPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const patient = await patientModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(password, salt);
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpires = undefined;
    await patient.save();

    res.status(200).json({ success: true, message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const patient = await patientModel.findOne({ email });
    if (!patient) {
      // To prevent user enumeration, it's better to send a generic success message
      // even if the user is not found. The frontend will show the same message.
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    patient.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    patient.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await patient.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // In a development environment, log the reset link to the console
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password Reset URL for ${patient.email}: ${resetUrl}`);
    }

    // Attempt to send the email
    if (!process.env.OWNER_EMAIL || !process.env.OWNER_EMAIL_PASS) {
      console.error('Email service is not configured. Please set OWNER_EMAIL and OWNER_EMAIL_PASS environment variables.');
      // Do not expose server configuration errors to the client
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.OWNER_EMAIL,
        pass: process.env.OWNER_EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: patient.email,
      from: process.env.OWNER_EMAIL,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        This link will expire in one hour.\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
  }
};

// Patient Login
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if patient exists
    const patient = await patientModel.findOne({ email });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create and assign a token
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: '7h',
    });

    res.status(200).json({ success: true, message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let patient = await patientModel.findOne({ email });
    if (!patient) {
      patient = new patientModel({
        name,
        email,
        profilePicture: picture,
        isGoogle: true,
      });
      await patient.save();
    }

    const jwtToken = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: '7h',
    });

    res.status(200).json({ success: true, message: 'Logged in successfully', token: jwtToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
