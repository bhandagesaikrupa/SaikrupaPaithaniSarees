


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
import cloudinary from "cloudinary";
import { 
  getProducts, 
  getProductById,   
  addProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";

// Configure Cloudinary with better error handling
//console.log("🔧 Configuring Cloudinary...");
//console.log("🌐 Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "Set ✅" : "Missing ❌");
//console.log("🔑 API Key:", process.env.CLOUDINARY_API_KEY ? "Set ✅" : "Missing ❌");
//console.log("🔒 API Secret:", process.env.CLOUDINARY_API_SECRET ? "Set ✅" : "Missing ❌");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// SIMPLIFIED Cloudinary upload
const uploadToCloudinary = async (req, res, next) => {
  try {
    //console.log("📤 Starting Cloudinary upload...");
    //console.log("📁 Number of files:", req.files ? req.files.length : 0);
    
    if (!req.files || req.files.length === 0) {
      //console.log("ℹ️ No files to upload");
      req.body.images = [];
      return next();
    }

    const imageUrls = [];
    
    // Upload files one by one (more reliable)
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      try {
        //console.log(`🔄 Uploading ${i + 1}/${req.files.length}: ${file.originalname}`);
        
        // Convert buffer to base64 (more reliable method)
        const base64Image = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64Image}`;
        
        //console.log("📡 Uploading to Cloudinary...");
        
        const result = await cloudinary.v2.uploader.upload(dataURI, {
          folder: "saikrupa-paithani",
          resource_type: "image",
          timeout: 30000 // 30 second timeout
        });
        
        //console.log(`✅ Upload successful: ${result.secure_url}`);
        imageUrls.push(result.secure_url);
        
      } catch (fileError) {
        console.error(`❌ Failed to upload ${file.originalname}:`, fileError);
        console.error(`❌ Error message: ${fileError.message}`);
        
        throw new Error(`Failed to upload ${file.originalname}: ${fileError.message}`);
      }
    }
    
    req.body.images = imageUrls;
    //console.log("🎯 All uploads completed. URLs:", imageUrls);
    next();
    
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    console.error("❌ Error details:", error.message);
    
    res.status(500).json({ 
      error: "Failed to upload images to Cloudinary",
      details: error.message,
      suggestion: "Check Cloudinary credentials and file formats"
    });
  }
};

const router = express.Router();

// ✅ IMPORTANT: Test route must come BEFORE parameter routes
// Test route to check Cloudinary connection
router.get("/test-cloudinary", async (req, res) => {
  try {
    //console.log("🧪 Testing Cloudinary connection...");
    
    const result = await cloudinary.v2.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      { 
        folder: "saikrupa-paithani-test",
        timeout: 30000
      }
    );
    
    //console.log("✅ Cloudinary test successful!");
    res.json({ 
      success: true, 
      message: "Cloudinary is working correctly!",
      url: result.secure_url 
    });
    
  } catch (error) {
    console.error("❌ Cloudinary test failed:", error);
    res.status(500).json({ 
      success: false, 
      error: "Cloudinary connection failed",
      details: error.message 
    });
  }
});

// Routes - ORDER MATTERS!
router.get("/", getProducts);
router.post("/", upload.array("images", 5), uploadToCloudinary, addProduct);

// ✅ Parameter routes must come AFTER specific routes
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 5), uploadToCloudinary, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
