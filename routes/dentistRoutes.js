import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getDentistProfile,
  updateDentistProfile,
  getAllDentists,
  getDentistsByProblem,
  getDentistById,
} from "../controllers/dentistController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/profile", protect, getDentistProfile);
router.put(
  "/profile",
  protect,
  upload.single("image"),
  updateDentistProfile
);

router.get("/", getAllDentists);
router.get("/problem", getDentistsByProblem);
router.get("/:id", getDentistById);

export default router;
