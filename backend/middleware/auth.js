import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both adminId and userId fields in token
    const lookupId = decoded.adminId || decoded.userId || decoded.id;

    if (!lookupId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    // Try finding the user in both collections
    let user = await User.findById(lookupId).select("-password");
    let isFoundInAdmin = false;

    if (!user) {
      user = await Admin.findById(lookupId).select("-password");
      if (user) isFoundInAdmin = true;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role || (isFoundInAdmin ? 'admin' : 'user');

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token"
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }
  next();
};

export const authorizeUser = (req, res, next) => {
  const { userId } = req.params;
  if (req.userRole !== "admin" && req.userId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You cannot access this data"
    });
  }
  next();
};