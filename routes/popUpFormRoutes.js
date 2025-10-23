import express from "express";

import {
  submitEnquiry,
  getEnquiries,
  deleteEnquiry,
} from "../controllers/popUpFormController.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

// POST /api/enquiries
router.post("/", upload.single("file"), submitEnquiry);
router.get("/", getEnquiries);
router.delete("/:id", deleteEnquiry);

export default router;
