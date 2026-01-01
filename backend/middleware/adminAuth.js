import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token has adminId
        if (!decoded.adminId) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token type" 
            });
        }

        // Fetch admin from database
        const admin = await Admin.findById(decoded.adminId).select('-password');
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({ 
                success: false, 
                message: "Admin account is deactivated" 
            });
        }

        // Attach admin to request
        req.admin = admin;
        req.adminId = admin._id;
        req.adminRole = admin.role;
        
        next();
    } catch (err) {
        console.error('Admin auth error:', err.message);
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token" 
            });
        }
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token expired" 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: "Authentication failed" 
        });
    }
};

// Middleware for super-admin only
export const authorizeSuperAdmin = (req, res, next) => {
    if (req.adminRole !== 'super-admin') {
        return res.status(403).json({
            success: false,
            message: "Super-admin privileges required"
        });
    }
    next();
};

// Middleware for admin or super-admin
export const authorizeAdmin = (req, res, next) => {
    if (!req.adminRole || (req.adminRole !== 'admin' && req.adminRole !== 'super-admin')) {
        return res.status(403).json({
            success: false,
            message: "Admin privileges required"
        });
    }
    next();
};