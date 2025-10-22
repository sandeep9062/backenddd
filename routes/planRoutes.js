import express from "express";
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";

const router = express.Router();

// Routes
router.post("/", createPlan);     // Create new plan
router.get("/", getPlans);        // Get all plans
router.get("/:id", getPlanById);  // Get single plan
router.put("/:id", updatePlan);   // Update plan
router.delete("/:id", deletePlan); // Delete plan

export default router;
