// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ success: false, message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Correct secret key
//     req.userId = decoded.userId; // ✅ Save userId for later use
//     next();
//   } catch (err) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };





// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
  
//   if (!token) {
//     return res.status(401).json({ 
//       success: false, 
//       message: "No token provided" 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     req.userRole = decoded.role;
//     next();
//   } catch (err) {
//     console.error('❌ Token verification error:', err.message);
//     return res.status(401).json({ 
//       success: false, 
//       message: "Invalid token" 
//     });
//   }
// };

// export const authorizeAdmin = (req, res, next) => {
//   if (req.userRole !== 'admin') {
//     return res.status(403).json({
//       success: false,
//       message: "Access denied. Admin privileges required."
//     });
//   }
//   next();
// };




import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import User model

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database to ensure they still exist
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Attach full user object to request
    req.user = user;
    req.userId = user._id; // Keep for backward compatibility
    req.userRole = user.role;
    
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    
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

export const authorizeAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }
  next();
};

// Optional: Authorize based on user ownership
export const authorizeUser = (req, res, next) => {
  const { userId } = req.params;
  
  if (req.userRole !== 'admin' && req.userId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own data."
    });
  }
  next();
};