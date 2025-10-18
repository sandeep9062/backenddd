
import express from "express";
import { submitFixMyTeethCase } from "../controllers/fixMyTeethController.js";

import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/", upload.array("photo", 5), submitFixMyTeethCase);

export default router;
