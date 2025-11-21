


// import express from "express";
// import multer from "multer";
// import { 
//   getProducts, 
//   getProductById,   
//   addProduct, 
//   updateProduct, 
//   deleteProduct 
// } from "../controllers/productController.js";

// const router = express.Router();

// // Configure multer storage for image uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");  // Upload folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // Unique filename
//   }
// });

// const upload = multer({ storage });

// // Routes

// // Get all products
// router.get("/", getProducts);

// // Get a single product by ID
// router.get("/:id", getProductById);

// // Add a new product with up to 5 images
// router.post("/", upload.array("images", 5), addProduct);

// // Update a product (with image uploads if provided)
// router.put("/:id", upload.array("images", 5), updateProduct);

// // Delete a product
// router.delete("/:id", deleteProduct);

// export default router;







// import express from "express";
// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "cloudinary";
// import { 
//   getProducts, 
//   getProductById,   
//   addProduct, 
//   updateProduct, 
//   deleteProduct 
// } from "../controllers/productController.js";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ REPLACE THIS: Cloudinary storage instead of local disk storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: "saikrupa-paithani",
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//     transformation: [
//       { width: 800, height: 800, crop: "limit", quality: "auto" }
//     ]
//   },
// });

// const upload = multer({ 
//   storage: storage, // ✅ Now using Cloudinary storage
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// const router = express.Router();

// // Routes
// router.get("/", getProducts);
// router.get("/:id", getProductById);
// router.post("/", upload.array("images", 5), addProduct);
// router.put("/:id", upload.array("images", 5), updateProduct);
// router.delete("/:id", deleteProduct);

// export default router;


import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import { 
  getProducts, 
  getProductById,   
  addProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "saikrupa-paithani",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" }
    ]
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = express.Router();

// Routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.array("images", 5), addProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

export default router; // ✅ FIXED: Was "export default rout"
