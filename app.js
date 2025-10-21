import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
// importing routes
import authRoutes from "./routes/authRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import websiteImageRoutes from "./routes/websiteImageRoutes.js";

import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

import testimonialRoutes from "./routes/testimonialRoutes.js";

import NewsLetterRoutes from "./routes/NewsLetterRoute.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

import supportRoutes from "./routes/supportRoutes.js";
import fixMyTeethRoutes from "./routes/fixMyTeethRoutes.js";

import pharmaBrandRoutes from "./routes/pharmaBrandRoutes.js";
import cbctOpgLabsRoutes from "./routes/cbctOpgLabsRoutes.js";
import diagnosticLabRoutes from "./routes/diagnosticLabRoutes.js";

import clinicRoutes from "./routes/clinicRoutes.js";
import dentistRoutes from "./routes/dentistRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
connectDB();

const app = express();
const PORT = process.env.PORT || 9000;

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Temporary in-memory storage (use DB in real app)
const otpStore = new Map();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://frontenddd-sepia.vercel.app",

      "https://dashboarddd-nu.vercel.app",
    ],
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send(`Server is running on PORT: ${PORT}`);
});

// API routes

app.use("/api/users", userRoutes);
app.use("/api/v1/website-images", websiteImageRoutes);
app.use("/api/v1/site-settings", siteSettingsRoutes);

app.use("/api/v1/blogs", blogRoutes);

app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/cbct-opg-labs", cbctOpgLabsRoutes);
app.use("/api/diagnostic-labs", diagnosticLabRoutes);

app.use("/api/v1/testimonials", testimonialRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/newsletter", NewsLetterRoutes);

app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/fix-my-teeth", fixMyTeethRoutes);

app.use("/pharma-brand", pharmaBrandRoutes);

app.use("/api/v1/dentists", dentistRoutes);
app.use("/api/v1/patients", patientRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server Running at http://localhost:${PORT}`);
});
