import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Tablets",
        "Capsules",
        "Syrups",
        "Ointments",
        "Injections",
        "Drops",
        "Creams",
        "Supplements",
        "Dental Care",
        "Medical Devices",
        "Other",
      ],
      default: "Other",
    },

    description: {
      type: String,
      trim: true,
    },

    composition: {
      type: String,
      trim: true,
      default: "",
    },

    dosage: {
      type: String,
      trim: true,
      default: "",
    },

    prescriptionRequired: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    stockCount: {
      type: Number,
      required: [true, "Stock count is required"],
      min: 0,
    },

    expiryDate: {
      type: Date,
      required: false,
    },

    manufacturingDate: {
      type: Date,
      required: false,
    },

    manufacturer: {
      type: String,
      trim: true,
    },

    storageConditions: {
      type: String,
      trim: true,
      default: "Store in a cool, dry place away from sunlight",
    },

    weight: {
      type: Number,
      default: 0, // in grams
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],

    // For related filters
    tags: [{ type: String, trim: true }],

    // For ratings & reviews
    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
