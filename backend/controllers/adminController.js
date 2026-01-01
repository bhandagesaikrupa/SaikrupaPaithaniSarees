import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";

// Admin Registration (requires admin key)
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, adminKey } = req.body;
        
        // Validate input
        if (!name || !email || !password || !adminKey) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Check admin key
        const validAdminKey = process.env.ADMIN_REGISTRATION_KEY;
        if (!validAdminKey) {
            return res.status(500).json({ 
                success: false, 
                message: "Server configuration error" 
            });
        }

        if (adminKey !== validAdminKey) {
            return res.status(403).json({ 
                success: false, 
                message: "Invalid admin registration key" 
            });
        }

        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ 
                success: false, 
                message: "Admin already exists with this email" 
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 8 characters long" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create admin
        admin = new Admin({ 
            name, 
            email, 
            password: hashedPassword,
            role: "admin"
        });
        
        await admin.save();

        return res.status(201).json({ 
            success: true,
            message: "Admin registered successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Admin registration error:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: "Email already exists" 
            });
        }
        
        return res.status(500).json({ 
            success: false,
            message: "Server error during registration" 
        });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({ 
                success: false, 
                message: "Admin account is deactivated" 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Update last login
        admin.lastLogin = Date.now();
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                adminId: admin._id,
                email: admin.email,
                role: admin.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        return res.json({
            success: true,
            message: "Admin login successful",
            token: token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error during login" 
        });
    }
};

// Verify Admin Token
export const verifyAdmin = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
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

        return res.json({ 
            success: true,
            message: "Token is valid",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Token verification error:', err.message);
        
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

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        return res.json({ 
            success: true,
            admin: admin
        });
    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

// Admin Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: "Email is required" 
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.json({ 
                success: true,
                message: "If an admin account exists with this email, you will receive an OTP" 
            });
        }

        const otp = generateOTP();
        admin.otp = otp;
        admin.otpExpires = Date.now() + 10 * 60 * 1000;
        await admin.save();

        // Send email
        try {
            await sendEmail(
                admin.email, 
                "Admin Password Reset OTP", 
                `Your admin password reset OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
            );
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            return res.status(500).json({ 
                success: false,
                message: "Failed to send OTP email" 
            });
        }
        
        return res.json({ 
            success: true,
            message: "OTP sent successfully" 
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// Admin Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 8 characters long" 
            });
        }

        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid request" 
            });
        }
        
        if (!admin.otp || admin.otp !== otp) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid OTP" 
            });
        }
        
        if (admin.otpExpires < Date.now()) {
            return res.status(400).json({ 
                success: false,
                message: "OTP expired" 
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        admin.password = hashedPassword;
        admin.otp = undefined;
        admin.otpExpires = undefined;
        await admin.save();

        return res.json({ 
            success: true,
            message: "Password reset successfully" 
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// Check Admin Auth
export const checkAuth = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.json({ 
                success: false,
                isAuthenticated: false,
                message: "No token" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId).select('-password');
        
        if (!admin || !admin.isActive) {
            return res.json({ 
                success: false,
                isAuthenticated: false,
                message: "Admin not found or inactive" 
            });
        }

        return res.json({ 
            success: true,
            isAuthenticated: true,
            message: "Admin is authenticated",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        return res.json({ 
            success: false,
            isAuthenticated: false,
            message: "Authentication failed" 
        });
    }
};


export const logoutAdmin = async (req, res) => {
    try {
        // In JWT-based authentication, logout is handled client-side by removing the token
        // However, we can implement server-side token invalidation if needed
        
        // Option 1: Simple logout - client removes token
        // Option 2: Blacklist token if you want server-side control
        
        // For now, we'll use simple approach and log the logout action
        const token = req.headers.authorization?.split(" ")[1];
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Find admin and update last logout time
                const admin = await Admin.findById(decoded.adminId);
                if (admin) {
                    admin.lastLogout = Date.now();
                    await admin.save();
                    console.log(`Admin ${admin.email} logged out successfully`);
                }
            } catch (err) {
                // Token might be expired, but that's okay for logout
                console.log("Token verification failed during logout (might be expired):", err.message);
            }
        }

        return res.json({
            success: true,
            message: "Admin logged out successfully"
        });
    } catch (error) {
        console.error("Admin logout error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error during logout" 
        });
    }
};