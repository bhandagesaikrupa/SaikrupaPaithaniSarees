



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
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.post("/create", authenticate, createOrder);
router.get("/user-orders", authenticate, getUserOrders);
router.get("/all-orders", authenticate, getAllOrders);

// Order management routes
router.put("/:orderId/status", authenticate, updateOrderStatus);
router.put("/:orderId/delivery-date", authenticate, updateDeliveryDate);
router.put("/:orderId/payment-status", authenticate, updatePaymentStatus);
router.delete("/:orderId", authenticate, deleteOrder);
router.get("/:orderId", authenticate, getOrderById);

export default router;




