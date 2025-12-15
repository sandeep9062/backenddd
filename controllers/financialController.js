import FinancialData from "../models/FinancialData.js";

// Helper function to calculate percentage growth
const calculateGrowth = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // If previous was 0, and current is positive, 100% growth. If current is also 0, then 0% growth.
  }
  return ((current - previous) / previous) * 100;
};

// Helper function to get previous month and year
const getPreviousMonthYear = (month, year) => {
  let prevMonth = parseInt(month, 10) - 1;
  let prevYear = parseInt(year, 10);

  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }
  return { month: prevMonth.toString(), year: prevYear };
};


// @desc    Create new financial data for a month
// @route   POST /api/financial
// @access  Admin
const createFinancialData = async (req, res) => {
  const { month, year, revenue, expenses } = req.body;

  const financialDataExists = await FinancialData.findOne({ month, year });

  if (financialDataExists) {
    res.status(400).json({ message: "Financial data for this month and year already exists" });
    return;
  }

  const financialData = await FinancialData.create({
    month,
    year,
    revenue,
    expenses,
  });

  if (financialData) {
    res.status(201).json(financialData);
  } else {
    res.status(400).json({ message: "Invalid financial data" });
  }
};

// @desc    Get financial data for a specific month and year
// @route   GET /api/financial/:year/:month
// @access  Admin
const getFinancialDataByMonth = async (req, res) => {
  const { year, month } = req.params;

  const financialData = await FinancialData.findOne({ month, year }); // Corrected line

  if (financialData) {
    res.json(financialData);
  } else {
    res.status(404).json({ message: "Financial data not found for the specified month and year" });
  }
};

// @desc    Get all financial data (for charts/history)
// @route   GET /api/financial
// @access  Admin
const getAllFinancialData = async (req, res) => {
  const financialData = await FinancialData.find({});
  res.json(financialData);
};

// @desc    Get monthly financial summary with growth percentage
// @route   GET /api/financial/summary?month=<month>&year=<year>
// @access  Admin
const getMonthlyFinancialSummary = async (req, res) => {
  let { month, year } = req.query;

  // If month and year are not provided, default to current month and year
  if (!month || !year) {
    const currentDate = new Date();
    month = (currentDate.getMonth() + 1).toString(); // Month is 0-indexed
    year = currentDate.getFullYear().toString();
  }

  const currentMonthData = await FinancialData.findOne({ month, year });

  if (!currentMonthData) {
    // If no data for the current month, return 0 for everything
    return res.json({
      currentMonth: {
        revenue: { total: 0 },
        expenses: { total: 0 },
        profit: 0,
      },
      growth: {
        revenue: 0,
        expenses: 0,
        profit: 0,
      },
    });
  }

  const { month: prevMonth, year: prevYear } = getPreviousMonthYear(month, year);
  const previousMonthData = await FinancialData.findOne({ month: prevMonth.toString(), year: prevYear });

  let revenueGrowth = 0;
  let expensesGrowth = 0;
  let profitGrowth = 0;

  if (previousMonthData) {
    revenueGrowth = calculateGrowth(currentMonthData.revenue.total, previousMonthData.revenue.total);
    expensesGrowth = calculateGrowth(currentMonthData.expenses.total, previousMonthData.expenses.total);
    profitGrowth = calculateGrowth(currentMonthData.profit, previousMonthData.profit);
  } else {
    // If no previous month data, and current month has data, assume 100% growth (or just current value)
    if (currentMonthData.revenue.total > 0) revenueGrowth = 100;
    if (currentMonthData.expenses.total > 0) expensesGrowth = 100;
    if (currentMonthData.profit > 0) profitGrowth = 100;
  }

  res.json({
    currentMonth: {
      revenue: currentMonthData.revenue,
      expenses: currentMonthData.expenses,
      profit: currentMonthData.profit,
    },
    growth: {
      revenue: revenueGrowth,
      expenses: expensesGrowth,
      profit: profitGrowth,
    },
  });
};


// @desc    Update financial data for a specific month and year
// @route   PUT /api/financial/:id
// @access  Admin
const updateFinancialData = async (req, res) => {
  const { id } = req.params;
  const { revenue, expenses } = req.body;

  const financialData = await FinancialData.findById(id);

  if (financialData) {
    if (revenue) {
      financialData.revenue.subscriptionFees = revenue.subscriptionFees !== undefined ? revenue.subscriptionFees : financialData.revenue.subscriptionFees;
      financialData.revenue.commissionFromClinics = revenue.commissionFromClinics !== undefined ? revenue.commissionFromClinics : financialData.revenue.commissionFromClinics;
      financialData.revenue.advertisementRevenue = revenue.advertisementRevenue !== undefined ? revenue.advertisementRevenue : financialData.revenue.advertisementRevenue;
    }

    if (expenses) {
      financialData.expenses.marketing = expenses.marketing !== undefined ? expenses.marketing : financialData.expenses.marketing;
      financialData.expenses.salaries = expenses.salaries !== undefined ? expenses.salaries : financialData.expenses.salaries;
      financialData.expenses.techCost = expenses.techCost !== undefined ? expenses.techCost : financialData.expenses.techCost;
      financialData.expenses.operations = expenses.operations !== undefined ? expenses.operations : financialData.expenses.operations;
    }

    const updatedFinancialData = await financialData.save();
    res.json(updatedFinancialData);
  } else {
    res.status(404).json({ message: "Financial data not found" });
  }
};

export {
  createFinancialData,
  getFinancialDataByMonth,
  getAllFinancialData,
  updateFinancialData,
  getMonthlyFinancialSummary,
};
