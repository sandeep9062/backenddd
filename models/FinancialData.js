import mongoose from 'mongoose';

const financialDataSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  revenue: {
    subscriptionFees: {
      type: Number,
      default: 0,
    },
    commissionFromClinics: {
      type: Number,
      default: 0,
    },
    advertisementRevenue: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  expenses: {
    marketing: {
      type: Number,
      default: 0,
    },
    salaries: {
      type: Number,
      default: 0,
    },
    techCost: {
      type: Number,
      default: 0,
    },
    operations: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  profit: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Add a compound unique index for month and year
financialDataSchema.index({ month: 1, year: 1 }, { unique: true });

// Pre-save hook to calculate total revenue, expenses, and profit
financialDataSchema.pre('save', function(next) {
  this.revenue.total = this.revenue.subscriptionFees +
                        this.revenue.commissionFromClinics +
                        this.revenue.advertisementRevenue;
  this.expenses.total = this.expenses.marketing +
                         this.expenses.salaries +
                         this.expenses.techCost +
                         this.expenses.operations;
  this.profit = this.revenue.total - this.expenses.total;
  next();
});

const FinancialData = mongoose.model('FinancialData', financialDataSchema);

export default FinancialData;
