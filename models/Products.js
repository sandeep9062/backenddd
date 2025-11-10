import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    // ✅ Updated: main category (broader type)
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        // Existing categories
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
        // New dental care product categories
        "ToothBrushes",
        "Toothpaste",
        "MouthWash",
        "Tounge Cleaner",
        "Flossers",
        "Gum Paints",
        "Nicotine Tablets",
      ],
      default: "Other",
    },

    // ✅ Added: Subcategory (specific item under category)
    subcategory: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
    },

    uses: {
      type: String,
      trim: true,
    },

    advantages: {
      type: [String],
      default: [],
    },

    disadvantages: {
      type: [String],
      default: [],
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
    },

    manufacturingDate: {
      type: Date,
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

    // ✅ Cloudinary or static image storage
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],

    // ✅ Tags for search/filtering
    tags: [{ type: String, trim: true }],

    // ✅ Ratings
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

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// ✅ Export model
export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
