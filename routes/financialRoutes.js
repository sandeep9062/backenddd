import express from "express";
import {
  createFinancialData,
  getFinancialDataByMonth,
  getAllFinancialData,
  updateFinancialData,
  getMonthlyFinancialSummary,
} from "../controllers/financialController.js";
import { protect, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, checkAdmin, createFinancialData);
router.route("/:year/:month").get(protect, checkAdmin, getFinancialDataByMonth);
router.route("/").get(protect, checkAdmin, getAllFinancialData);
router.route("/summary").get(protect, checkAdmin, getMonthlyFinancialSummary);
router.route("/:id").put(protect, checkAdmin, updateFinancialData);

export default router;
