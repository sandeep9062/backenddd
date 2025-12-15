import express from "express";
import * as clinicController from "../controllers/clinicController.js";
import upload from "../middlewares/multer.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST - Add a new clinic
router.post("/", protect, upload.fields([
  { name: 'image', maxCount: 3 },
  { name: 'video', maxCount: 1 }
]), clinicController.addClinic);

// GET - Get all clinics
router.get("/", clinicController.getAllClinics);

// GET - Get clinics by user
router.get("/user", protect, clinicController.getClinicsByUser);

// GET - Get clinic by ID
router.get("/:id", clinicController.getClinicById);

// PUT - Update clinic
router.put("/:id", protect, upload.fields([
  { name: 'image', maxCount: 3 },
  { name: 'video', maxCount: 1 }
]), clinicController.updateClinic);

// DELETE - Delete clinic
router.delete("/:id", protect, checkAdmin, clinicController.deleteClinic);

export default router;
