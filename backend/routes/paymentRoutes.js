// import express from "express";
// import { 
//   createRazorpayOrder, 
//   verifyPayment, 
//   generateQRCode,
//   getPaymentStatus 
// } from "../controllers/paymentController.js";
// import { authenticate } from "../middleware/auth.js";

// const router = express.Router();

// // All payment routes are protected
// router.post("/create-order", authenticate, createRazorpayOrder);
// router.post("/verify", authenticate, verifyPayment);
// router.post("/generate-qr", authenticate, generateQRCode);
// router.get("/status/:orderId", authenticate, getPaymentStatus);

// export default router;






// import express from "express";
// import { 
//   createCashfreeOrder, 
//   verifyPayment, 
//   generateQRCode,
//   getPaymentStatus,
//   handleWebhook
// } from "../controllers/paymentController.js";
// import { authenticate } from "../middleware/auth.js";

// const router = express.Router();

// // All payment routes are protected except webhook
// router.post("/create-order", authenticate, createCashfreeOrder);
// router.post("/verify", authenticate, verifyPayment);
// router.post("/generate-qr", authenticate, generateQRCode);
// router.get("/status/:orderId", authenticate, getPaymentStatus);

// // Webhook route (no authentication needed)
// router.post("/webhook", handleWebhook);

// export default router;




// import express from "express";
// import { 
//   createCashfreeOrder, 
//   verifyPayment, 
//   generateQRCode,
//   getPaymentStatus,
//   handleWebhook,
//   testCashfreeConfig  // Add this
// } from "../controllers/paymentController.js";
// import { authenticate } from "../middleware/auth.js";

// const router = express.Router();

// // Test route (no authentication needed)
// router.get("/test-config", testCashfreeConfig);

// // All payment routes are protected except webhook and test
// router.post("/create-order", authenticate, createCashfreeOrder);
// router.post("/verify", authenticate, verifyPayment);
// router.post("/generate-qr", authenticate, generateQRCode);
// router.get("/status/:orderId", authenticate, getPaymentStatus);

// // Webhook route (no authentication needed)
// router.post("/webhook", handleWebhook);

// export default router;


import express from "express";
import { 
  createCashfreeOrder, 
  verifyPayment, 
  generateQRCode,
  getPaymentStatus,
  handleWebhook,
  testCashfreeConfig,
  testRoute
} from "../controllers/paymentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Test routes (no authentication needed)
router.get("/test", testRoute);
router.get("/test-config", testCashfreeConfig);

// All payment routes are protected except webhook and test
router.post("/create-order", authenticate, createCashfreeOrder);
router.post("/verify", authenticate, verifyPayment);
router.post("/generate-qr", authenticate, generateQRCode);
router.get("/status/:orderId", authenticate, getPaymentStatus);

// Webhook route (no authentication needed)
router.post("/webhook", handleWebhook);

export default router;