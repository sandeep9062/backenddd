import express from "express";
import {
  addDiagnosticLab,
  getAllDiagnosticLabs,
  getDiagnosticLabById,
  updateDiagnosticLab,
  deleteDiagnosticLab,
} from "../controllers/diagnosticLabController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// ✅ Routes
router
  .route("/")
  .get(getAllDiagnosticLabs)
  .post(protect, upload.single("img"), addDiagnosticLab);

router
  .route("/:id")
  .get(getDiagnosticLabById)
  .put(protect, upload.single("img"), updateDiagnosticLab)
  .delete(protect, checkAdmin, deleteDiagnosticLab);

export default router;
