const express = require("express");
const {
  createFinancialData,
  getFinancialDataByMonth,
  getAllFinancialData,
  updateFinancialData,
  getMonthlyFinancialSummary,
} = require("../controllers/financialController");
const { protect, checkAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, checkAdmin, createFinancialData);
router.route("/:year/:month").get(protect, checkAdmin, getFinancialDataByMonth);
router.route("/").get(protect, checkAdmin, getAllFinancialData);
router.route("/summary").get(protect, checkAdmin, getMonthlyFinancialSummary); 
router.route("/:id").put(protect, checkAdmin, updateFinancialData);

module.exports = router;
