



// import express from "express";
// import { 
//   createOrder, 
//   getUserOrders, 
//   getOrderById, 
//   getAllOrders,
//   updateOrderStatus,
//   deleteOrder, // ADD THIS IMPORT
//    updatePaymentStatus
// } from "../controllers/orderController.js";
// import { authenticate } from "../middleware/auth.js";

// const router = express.Router();

// // All routes are protected
// router.post("/create", authenticate, createOrder);
// router.get("/user-orders", authenticate, getUserOrders);

// // FIX: Put specific routes BEFORE parameterized routes
// router.get("/all-orders", authenticate, getAllOrders);
// router.put("/:orderId/status", authenticate, updateOrderStatus);
// router.delete("/:orderId", authenticate, deleteOrder); // ADD THIS LINE
// router.get("/:orderId", authenticate, getOrderById);
// router.put("/:orderId/payment-status", authenticate, updatePaymentStatus);

// export default router;



// import express from "express";
// import { 
//   createOrder, 
//   getUserOrders, 
//   getOrderById, 
//   getAllOrders,
//   updateOrderStatus,
//   deleteOrder,
//   updatePaymentStatus,
//   updateDeliveryDate
// } from "../controllers/orderController.js";
// import { authenticate } from "../middleware/auth.js";

// const router = express.Router();

// // All routes are protected
// router.post("/create", authenticate, createOrder);
// router.get("/user-orders", authenticate, getUserOrders);
// router.get("/all-orders", authenticate, getAllOrders);

// // Order management routes
// router.put("/:orderId/status", authenticate, updateOrderStatus);
// router.put("/:orderId/delivery-date", authenticate, updateDeliveryDate);
// router.put("/:orderId/payment-status", authenticate, updatePaymentStatus);
// router.delete("/:orderId", authenticate, deleteOrder);
// router.get("/:orderId", authenticate, getOrderById);

// export default router;






import express from "express";
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updatePaymentStatus,
  updateDeliveryDate
} from "../controllers/orderController.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Order creation and user-specific routes
router.post("/create", createOrder);
router.get("/user-orders", getUserOrders);
router.get("/:orderId", getOrderById);

// Admin-only routes
router.get("/", authorizeAdmin, getAllOrders);
router.put("/:orderId/status", authorizeAdmin, updateOrderStatus);
router.put("/:orderId/payment-status", authorizeAdmin, updatePaymentStatus);
router.put("/:orderId/delivery-date", authorizeAdmin, updateDeliveryDate);
router.delete("/:orderId", authorizeAdmin, deleteOrder);

export default router;