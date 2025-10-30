import mongoose from "mongoose";
import Product from "../models/Products.js";
import asyncHandler from "express-async-handler"; // optional but helps handle async errors

// ==========================
// @desc    Get all products (with pagination + filters)
// @route   GET /api/products
// @access  Public
// ==========================
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: "i" },
      }
    : {};

  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const brand = req.query.brand ? { brand: req.query.brand } : {};

  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...brand,
  });

  const products = await Product.find({
    ...keyword,
    ...category,
    ...brand,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
  });
});

// ==========================
// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
// ==========================
export const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error("Product not found");
  }
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ==========================
// @desc    Create new product
// @route   POST /api/products
// @access  Admin
// ==========================
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    category,
    subcategory,
    description,
    composition,
    dosage,
    price,
    discountPrice,
    stockCount,
    expiryDate,
    manufacturingDate,
    manufacturer,
    storageConditions,
    weight,
    tags,
  } = req.body;

  // Handle boolean conversion
  const prescriptionRequired = req.body.prescriptionRequired === "true";
  const isActive = req.body.isActive === "true";

  // Handle image uploads
  const images = req.files
    ? req.files.map((file) => ({
        url: file.path, // Assuming multer-storage-cloudinary is used
        public_id: file.filename,
      }))
    : [];

  // Handle tags - could be a single string or an array
  let tagsArray = [];
  if (tags) {
    tagsArray = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
  }

  const product = new Product({
    user: req.user._id,
    name,
    brand,
    category,
    subcategory,
    description,
    composition,
    dosage,
    prescriptionRequired,
    price,
    discountPrice,
    stockCount,
    expiryDate,
    manufacturingDate,
    manufacturer,
    storageConditions,
    weight,
    images,
    tags: tagsArray,
    isActive,
    // Set default rating/reviews, assuming user is admin
    rating: 0,
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// ==========================
// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
// ==========================
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Update fields from req.body
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.subcategory = req.body.subcategory || product.subcategory;
    product.description = req.body.description || product.description;
    product.composition = req.body.composition || product.composition;
    product.dosage = req.body.dosage || product.dosage;
    product.price = req.body.price || product.price;
    product.discountPrice = req.body.discountPrice || product.discountPrice;
    product.stockCount = req.body.stockCount || product.stockCount;
    product.expiryDate = req.body.expiryDate || product.expiryDate;
    product.manufacturingDate =
      req.body.manufacturingDate || product.manufacturingDate;
    product.manufacturer = req.body.manufacturer || product.manufacturer;
    product.storageConditions =
      req.body.storageConditions || product.storageConditions;
    product.weight = req.body.weight || product.weight;

    // Handle boolean conversion
    if (req.body.prescriptionRequired !== undefined) {
      product.prescriptionRequired = req.body.prescriptionRequired === "true";
    }
    if (req.body.isActive !== undefined) {
      product.isActive = req.body.isActive === "true";
    }

    // Handle tags
    if (req.body.tags) {
      const { tags } = req.body;
      product.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim());
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Optional: Add logic here to delete old images from cloud storage
      product.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ==========================
// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
// ==========================
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ==========================
// @desc    Get top-rated products
// @route   GET /api/products/top
// @access  Public
// ==========================
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(5);
  res.json(products);
});
