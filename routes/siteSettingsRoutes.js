import express from "express";
import {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
  deleteSiteSettings,
} from "../controllers/siteSettingsController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

// Single-document CRUD
router.get("/", getSiteSettings);
router.post("/", upload.none(), protect, checkAdmin, createSiteSettings);
router.put("/:id", upload.none(), protect, checkAdmin, updateSiteSettings);
router.delete("/:id", upload.none(), protect, checkAdmin, deleteSiteSettings);

export default router;
