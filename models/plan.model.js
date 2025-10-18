const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic', 'Growth', 'Premium'],
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: {
    clinicListing: {
      clinicCount: { type: Number, required: true },
      verifiedBadge: { type: Boolean, default: false },
      priorityInSearch: { type: Boolean, default: false },
      googleReviews: { type: Boolean, default: false }
    },
    emailMarketing: {
      newsletter: { type: Boolean, default: false },
      frequency: { type: Number, default: 0 } // emails/month
    },
    socialMedia: {
      instagramPosts: { type: Number, default: 0 },
      instagramStories: { type: Number, default: 0 },
      instagramAdBoost: { type: Boolean, default: false },
      youtubeListing: { type: Boolean, default: false },
      youtubeVideos: { type: Number, default: 0 }
    },
    platformUsage: {
      allPosting: { type: Boolean, default: false }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Static method to initialize hardcoded plans
planSchema.statics.initializePlans = async function() {
  const plans = [
    {
      name: 'Basic',
      price: 1100,
      features: {
        clinicListing: {
          clinicCount: 1,
          verifiedBadge: true,
          priorityInSearch: false,
          googleReviews: false
        },
        emailMarketing: {
          newsletter: false,
          frequency: 0
        },
        socialMedia: {
          instagramPosts: 1,
          instagramStories: 0,
          instagramAdBoost: false,
          youtubeListing: false,
          youtubeVideos: 0
        },
        platformUsage: {
          allPosting: true
        }
      }
    },
    {
      name: 'Growth',
      price: 2200,
      features: {
        clinicListing: {
          clinicCount: 1,
          verifiedBadge: true,
          priorityInSearch: true,
          googleReviews: true
        },
        emailMarketing: {
          newsletter: true,
          frequency: 1
        },
        socialMedia: {
          instagramPosts: 2,
          instagramStories: 1,
          instagramAdBoost: true,
          youtubeListing: true,
          youtubeVideos: 0
        },
        platformUsage: {
          allPosting: true
        }
      }
    },
    {
      name: 'Premium',
      price: 3200,
      features: {
        clinicListing: {
          clinicCount: 2,
          verifiedBadge: true,
          priorityInSearch: true,
          googleReviews: true
        },
        emailMarketing: {
          newsletter: true,
          frequency: 1
        },
        socialMedia: {
          instagramPosts: 2,
          instagramStories: 1,
          instagramAdBoost: true,
          youtubeListing: true,
          youtubeVideos: 1
        },
        platformUsage: {
          allPosting: true
        }
      }
    }
  ];

  await this.deleteMany({});
  return this.insertMany(plans);
};

module.exports = mongoose.model('Plan', planSchema);