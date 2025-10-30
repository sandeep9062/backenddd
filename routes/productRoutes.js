import express from "express";
import * as productController from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import { protect, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ POST - Add a new product 
router.post(
  "/",
  protect,
  upload.array("images", 3), // Max 3 images
  productController.createProduct
);

// ✅ GET - Get all products (Public)
router.get("/", productController.getProducts);

// ✅ GET - Get top products (Public)
router.get("/top", productController.getTopProducts);

// ✅ GET - Get single product by ID (Public)
router.get("/:id", productController.getProductById);

// ✅ PUT - Update product 
router.put(
  "/:id",
  protect,
  upload.array("images", 3), // Max 3 images
  productController.updateProduct
);

// ✅ DELETE - Delete product (Admin only)
router.delete("/:id", protect, checkAdmin, productController.deleteProduct);

export default router;
