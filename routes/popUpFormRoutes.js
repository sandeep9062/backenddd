import express from "express";

import { submitEnquiry } from "../controllers/popUpFormController.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

// POST /api/enquiries
router.post("/", upload.single("file"), submitEnquiry);

export default router;
