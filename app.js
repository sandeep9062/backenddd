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
import consultationRoutes from "./routes/consultationRoutes.js";
import planRoutes from "./routes/planRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";

import popupformRoutes from "./routes/popUpFormRoutes.js";
import productRoutes from "./routes/productRoutes.js";

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

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/website-images", websiteImageRoutes);
app.use("/api/v1/site-settings", siteSettingsRoutes);

app.use("/api/v1/blogs", blogRoutes);

app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/cbct-opg-labs", cbctOpgLabsRoutes);
app.use("/api/v1/diagnostic-labs", diagnosticLabRoutes); // corrected v1

app.use("/api/v1/testimonials", testimonialRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/newsletter", NewsLetterRoutes);

app.use("/api/v1/appointments", appointmentRoutes);

app.use("/api/v1/fix-my-teeth", fixMyTeethRoutes);

app.use("/pharma-brand", pharmaBrandRoutes);

app.use("/api/v1/dentists", dentistRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/v1/consultations", consultationRoutes);


app.use("/api/v1/popup-form", popupformRoutes);

app.use("/api/v1/products", productRoutes);







app.use("/api/payment", paymentRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server Running at http://localhost:${PORT}`);
});
