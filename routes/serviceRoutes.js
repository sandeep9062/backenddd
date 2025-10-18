import express from "express";
import upload from "../middlewares/multer.js";
import {
  createService,
  getServices,
  getServiceBySlug,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const serviceImageUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'serviceImage', maxCount: 1 },
]);

// Service Routes
router.post("/", protect, checkAdmin, serviceImageUpload, createService);
router.get("/", getServices);
router.get("/:slug", getServiceBySlug);
router.put("/:id", protect, checkAdmin, serviceImageUpload, updateService); // Change to :id
router.delete("/:id", protect, checkAdmin, deleteService); // Change to :id

export default router;