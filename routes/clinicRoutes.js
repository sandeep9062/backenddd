import express from "express";
import * as clinicController from "../controllers/clinicController.js";
import upload from "../middlewares/multer.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST - Add a new clinic
router.post("/", protect, upload.single("image"), clinicController.addClinic);

// GET - Get all clinics
router.get("/", clinicController.getAllClinics);

// GET - Get clinic by ID
router.get("/:id", clinicController.getClinicById);

// PUT - Update clinic
router.put(
  "/:id",
  protect,
  upload.single("image"),
  clinicController.updateClinic
);

// DELETE - Delete clinic
router.delete("/:id", protect, checkAdmin, clinicController.deleteClinic);

export default router;
