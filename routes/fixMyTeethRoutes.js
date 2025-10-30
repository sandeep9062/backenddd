import express from "express";
import {
  submitFixMyTeethCase,
  getFixMyTeethCases,
  getFixMyTeethCaseById,
  getMyFixMyTeethSubmissions,
} from "../controllers/fixMyTeethController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/", upload.array("photo", 6), submitFixMyTeethCase);
router.get("/", protect, checkAdmin, getFixMyTeethCases);
router.get("/my", protect, getMyFixMyTeethSubmissions);
router.get("/:id", getFixMyTeethCaseById);

export default router;
