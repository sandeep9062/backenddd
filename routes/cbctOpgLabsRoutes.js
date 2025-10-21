import express from "express";
import upload from "../middlewares/multer.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";
import {
  addCbctOpgLab,
  getAllCbctOpgLabs,
  getCbctOpgLabById,
  updateCbctOpgLab,
  deleteCbctOpgLab,
} from "../controllers/cbctOpgLabsController.js";

const router = express.Router();

// Routes
router.post("/", protect, upload.single("img"), addCbctOpgLab);
router.get("/", getAllCbctOpgLabs);
router.get("/:id", getCbctOpgLabById);
router.put("/:id", protect ,upload.single("img"), updateCbctOpgLab);
router.delete("/:id", protect, checkAdmin, deleteCbctOpgLab);

export default router;
