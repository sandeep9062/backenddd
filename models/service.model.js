// const { DENTAL_SERVICES } = require('../config/constants');

// const dentalServices = {
//    BASIC_CLEANING: {
//     id: 'dental_cleaning',
//     name: 'Basic Teeth Cleaning',
//     price: DENTAL_SERVICES.BASIC_CLEANING, // Ensure this matches exactly
//     description: 'Professional teeth cleaning and polishing',
//     duration: '30 mins'
//   },
//   FILLING: {
//     id: 'dental_filling',
//     name: 'Tooth Filling',
//     price: DENTAL_SERVICES.FILLING,
//     description: 'Cavity filling with composite material',
//     duration: '45-60 mins'
//   },
//   ROOT_CANAL: {
//     id: 'dental_root_canal',
//     name: 'Root Canal Treatment',
//     price: DENTAL_SERVICES.ROOT_CANAL,
//     description: 'Single sitting root canal treatment',
//     duration: '90-120 mins'
//   }
// };

// module.exports = {
//   getServiceById: (serviceId) => {
//     const service = Object.values(dentalServices).find(s => s.id === serviceId);
//     if (!service) {
//       throw new Error(`Service not found: ${serviceId}`);
//     }
//     return service;
//   },
//   getAllServices: () => Object.values(dentalServices)
// };


const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  planType: {
    type: String,
    required: true,
    enum: ['Basic', 'Growth', 'Premium']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'expired', 'cancelled'],
    default: 'pending'
  },
  paymentDetails: {
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    receipt: { type: String, required: true }
  },
  featuresSnapshot: {
    type: Object,
    required: true
  },
  isAutoRenew: {
    type: Boolean,
    default: true
  },
  nextBillingDate: Date
}, { timestamps: true });

// Pre-save hook to set dates and snapshot features
subscriptionSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Set end date (1 month from now)
    this.endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    
    // Set next billing date if auto-renew
    if (this.isAutoRenew) {
      this.nextBillingDate = this.endDate;
    }

    // Snapshot the plan features
    const plan = await mongoose.model('Plan').findById(this.planId);
    this.featuresSnapshot = plan.features;
    this.planType = plan.name;
  }
  next();
});

// Instance method to check active status
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && new Date() < this.endDate;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);