import express from "express";
import * as consultationController from "../controllers/consultationController.js";
import { protect, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST - Add new consultation
router.post("/", consultationController.addConsultation);

// GET - All consultations (Admin)
router.get("/", protect, checkAdmin, consultationController.getAllConsultations);

// GET - Logged-in user's consultations
router.get("/my", protect, consultationController.getConsultationsByUser);

// GET - Logged-in dentist's consultations
router.get(
  "/dentist/my",
  protect,
  consultationController.getConsultationsByDentist
);

// GET - Single consultation by ID
router.get("/:id", protect, consultationController.getConsultationById);

// PUT - Update consultation
router.put("/:id", protect, consultationController.updateConsultation);

// PUT - Update consultation status (Admin or Dentist)
router.put("/:id/status", protect, consultationController.updateConsultationStatus);

// DELETE - Delete consultation
router.delete("/:id", protect, checkAdmin, consultationController.deleteConsultation);

export default router;
