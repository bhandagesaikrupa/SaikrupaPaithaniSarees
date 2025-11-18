// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.js";
// import productRoutes from "./routes/product.js"; // ✅ newly added
// import cartRoutes from "./routes/cartRoutes.js";
// import { authenticate } from "./middleware/auth.js";
// import orderRoutes from './routes/orderRoutes.js';
// import reviewRoutes from './routes/reviewRoutes.js';
// import youtubeVideoRoutes from "./routes/youtubeVideoRoutes.js";
//  import paymentRoutes from './routes/paymentRoutes.js';

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve frontend static files
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "../frontend/pages")));
// app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// // Default route - serve homepage
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/pages/home.html"));
// });
// app.get("/admin", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/pages/admin.html"));
// });

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes); // ✅ added product management routes
// app.use("/api/cart", authenticate, cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use("/api/youtube-videos", youtubeVideoRoutes);
//  app.use('/api/payments', paymentRoutes);

// // 404 Fallback for unknown routes
// app.use((req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "../frontend/pages/404.html"));
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// // 🔥 LOAD ENVIRONMENT VARIABLES FIRST - THIS IS CRITICAL
// dotenv.config();

// // Debug: Check if environment variables are loaded
// console.log('🔑 Environment Variables Check:');
// console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Loaded' : 'MISSING');
// console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '***' + process.env.RAZORPAY_KEY_SECRET.slice(-4) : 'MISSING');
// console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'MISSING');
// console.log('PORT:', process.env.PORT);

// import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.js";
// import productRoutes from "./routes/product.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import { authenticate } from "./middleware/auth.js";
// import orderRoutes from './routes/orderRoutes.js';
// import reviewRoutes from './routes/reviewRoutes.js';
// import youtubeVideoRoutes from "./routes/youtubeVideoRoutes.js";
// import paymentRoutes from './routes/paymentRoutes.js';
//  import emailRoutes from './routes/emailRoutes.js';

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve frontend static files
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "../frontend/pages")));
// app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// // Default route - serve homepage
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/pages/home.html"));
// });
// app.get("/admin", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/pages/admin.html"));
// });

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", authenticate, cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use("/api/youtube-videos", youtubeVideoRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/email', emailRoutes);


// // // 404 Fallback for unknown routes
// // app.use((req, res) => {
// //   res.status(404).sendFile(path.join(__dirname, "../frontend/pages/404.html"));
// // });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));








import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Debug Cashfree configuration
console.log('🔧 Cashfree Config Check:');
console.log('CASHFREE_APP_ID:', process.env.CASHFREE_APP_ID ? '✓ Loaded' : '✗ MISSING');
console.log('CASHFREE_SECRET_KEY:', process.env.CASHFREE_SECRET_KEY ? '✓ Loaded' : '✗ MISSING');
console.log('CASHFREE_ENVIRONMENT:', process.env.CASHFREE_ENVIRONMENT);

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cartRoutes.js";
import { authenticate } from "./middleware/auth.js";
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import youtubeVideoRoutes from "./routes/youtubeVideoRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "../frontend/pages")));
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Test endpoint for Cashfree
app.get("/api/cashfree-test", (req, res) => {
  res.json({
    success: true,
    cashfree: {
      appId: process.env.CASHFREE_APP_ID ? 'Loaded' : 'Missing',
      secretKey: process.env.CASHFREE_SECRET_KEY ? 'Loaded' : 'Missing',
      environment: process.env.CASHFREE_ENVIRONMENT
    }
  });
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/home.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/admin.html"));
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", authenticate, cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/youtube-videos", youtubeVideoRoutes);
app.use('/api/payments', paymentRoutes);  // Cashfree routes
app.use('/api/email', emailRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💳 Cashfree: ${process.env.CASHFREE_APP_ID ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
  console.log(`📍 Test Cashfree: http://localhost:${PORT}/api/cashfree-test`);
});