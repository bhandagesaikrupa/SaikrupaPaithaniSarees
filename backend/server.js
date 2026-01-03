import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cartRoutes.js";
import { authenticate } from "./middleware/auth.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import youtubeVideoRoutes from "./routes/youtubeVideoRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ES Modules path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// 🌐 Middleware (SAFE + STABLE)
// =====================
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// 📁 Static Files (OLD BEHAVIOR RESTORED)
// =====================

// Frontend pages
app.use(express.static(path.join(__dirname, "../frontend/pages")));

// Uploads — EXACTLY like your old working setup
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// =====================
// 🔌 API Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", authenticate, cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/youtube-videos", youtubeVideoRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/admin", adminRoutes);

// =====================
// 🧪 Health Check
// =====================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        time: new Date().toISOString()
    });
});

// =====================
// 🖥️ Frontend Routes
// =====================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/home1.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/signup.html"));
});

app.get("/dashboard1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/dashboard1.html"));
});

app.get("/orders1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/orders1.html"));
});

app.get("/admin1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/admin1.html"));
});

app.get("/youtube-admin1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/youtube-admin1.html"));
});

app.get("/cart1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/cart1.html"));
});

app.get("/description1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/description1.html"));
});

app.get("/checkout_page1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/checkout_page1.html"));
});

app.get("/confirmation1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/confirmation1.html"));
});

app.get("/history1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/history1.html"));
});

app.get("/product1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/product1.html"));
});

app.get("/reviews1", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/reviews1.html"));
});

// =====================
// 🧭 FINAL FALLBACK — FIXES ALL 404 FRONTEND ISSUES
// =====================
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/home1.html"));
});

// =====================
// 🧯 Error Handler
// =====================
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message
    });
});

// =====================
// 🚀 Start Server
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
