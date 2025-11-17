


import express from "express";
import multer from "multer";
import { 
  getProducts, 
  getProductById,   
  addProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";

const router = express.Router();

// Configure multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");  // Upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  }
});

const upload = multer({ storage });

// Routes

// Get all products
router.get("/", getProducts);

// Get a single product by ID
router.get("/:id", getProductById);

// Add a new product with up to 5 images
router.post("/", upload.array("images", 5), addProduct);

// Update a product (with image uploads if provided)
router.put("/:id", upload.array("images", 5), updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);

export default router;
