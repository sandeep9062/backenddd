import express from "express";
import {
  createUniform,
  getUniforms,
  getUniform,
  updateUniform,
  deleteUniform,
} from "../controllers/uniformController.js";
import upload from "../middlewares/multer.js"; // Your Cloudinary multer middleware
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// ✅ Routes
router.get("/", getUniforms);
router.get("/:id", getUniform);
router.post("/", protect, checkAdmin, upload.single("image"), createUniform);
router.put("/:id", protect, checkAdmin, upload.single("image"), updateUniform);
router.delete("/:id", protect, checkAdmin, deleteUniform);

export default router;
