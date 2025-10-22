
import express from "express";
import {
  submitFixMyTeethCase,
  getFixMyTeethCases,
  getFixMyTeethCaseById,
} from "../controllers/fixMyTeethController.js";

import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/", upload.array("photo", 5), submitFixMyTeethCase);
router.get("/", getFixMyTeethCases);
router.get("/:id", getFixMyTeethCaseById);

export default router;
