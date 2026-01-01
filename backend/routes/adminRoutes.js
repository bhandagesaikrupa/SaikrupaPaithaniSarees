import express from "express";
import { 
    registerAdmin, 
    loginAdmin, 
        logoutAdmin,
    forgotPassword, 
    resetPassword,
    verifyAdmin,
    getAdminProfile,
    checkAuth
} from "../controllers/adminController.js";
import { authenticateAdmin, authorizeAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post('/logout', logoutAdmin);
router.post("/reset-password", resetPassword);
router.get("/verify", verifyAdmin);
router.get("/check-auth", checkAuth);

// ========== PROTECTED ROUTES ==========
router.get("/profile", authenticateAdmin, getAdminProfile);
router.get("/dashboard", authenticateAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Admin Dashboard",
        admin: req.admin
    });
});

// Test super-admin route
router.get("/super-admin-only", authenticateAdmin, authorizeAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Super admin access granted",
        admin: req.admin
    });
});

export default router;