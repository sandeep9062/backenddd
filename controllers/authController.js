import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import crypto from "crypto";
import axios from "axios";

import sendEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==================
// NORMAL SIGNUP
// ==================
export const registerUser = async (req, res) => {
  try {
    const { name, email,phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user);

    // Send notification to owner
    try {
      await Notification.create({
        text: `New user registered: ${user.name}`,
      });
      const ownerEmail = process.env.OWNER_RECEIVER_EMAIL;
      if (ownerEmail) {
        const message = `
          <h3>New User Registration</h3>
          <p>A new user has registered on the platform:</p>
          <ul>
            <li><strong>Name:</strong> ${user.name}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Phone:</strong> ${user.phone}</li>
            <li><strong>Role:</strong> ${user.role}</li>
          </ul>
        `;
        await sendEmail({
          to: ownerEmail,
          subject: "New User Registration Notification",
          html: message,
        });
      }
    } catch (emailError) {
      console.error("Error sending owner notification email:", emailError);
      // Decide if you want to fail the request or just log the error
    }

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ==================
// NORMAL LOGIN
// ==================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    const { _id, name, role, phone } = user;
    res
      .status(200)
      .json({ user: { _id, name, email, role, phone }, token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ==================
// GOOGLE LOGIN/SIGNUP
// ==================
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // If user exists, generate token and send back
      const jwtToken = generateToken(user);
      return res.status(200).json({ user, token: jwtToken });
    }

    // If new user, create account
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      googleId,
      role: "patient", // default role; can update later
      profile: { avatar: picture },
    });

    const jwtToken = generateToken(user);
    res.status(200).json({ user, token: jwtToken });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({ message: "Google authentication failed", error });
  }
};

// ============================
// FORGOT PASSWORD
// ============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token to DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
      <h3>Password Reset Request</h3>
      <p>Hello ${user.name},</p>
      <p>You requested to reset your password. Please click the link below to set a new password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset - Dental Website",
      html: message,
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email", error });
  }
};

// ===========================
// RESET PASSWORD
// ===========================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password & clear token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};
