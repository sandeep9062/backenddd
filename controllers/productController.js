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
    tags,
  } = req.body;

  const product = new Product({
    name,
    brand,
    category,
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
    tags,
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
    Object.assign(product, req.body);
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
