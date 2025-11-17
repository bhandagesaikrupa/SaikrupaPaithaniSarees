


import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ================== Helper: Get or Create Cart ==================
const getOrCreateCart = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  let cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
    await cart.populate("items.productId");
  }

  return cart;
};

// ================== GET CART ==================
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await getOrCreateCart(userId);

    return res.json({ success: true, cart });
  } catch (err) {
    console.error("Get Cart Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch cart", error: err.message });
  }
});

// ================== ADD TO CART ==================
router.post("/add", authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    if (!productId) return res.status(400).json({ success: false, message: "Product ID is required" });

    const qty = parseInt(quantity) || 1;
    if (isNaN(qty) || qty <= 0) return res.status(400).json({ success: false, message: "Quantity must be positive" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    let cart = await getOrCreateCart(userId);

    // Check if item already exists
    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: qty
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    return res.json({ success: true, message: "Product added to cart", cart });

  } catch (err) {
    console.error("Add to Cart Error:", err);
    return res.status(500).json({ success: false, message: "Failed to add product to cart", error: err.message });
  }
});

// ================== UPDATE QUANTITY ==================
router.put("/update/:productId", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    const qty = parseInt(req.body.quantity);

    if (isNaN(qty) || qty <= 0) return res.status(400).json({ success: false, message: "Quantity must be positive" });

    let cart = await getOrCreateCart(userId);

    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    item.quantity = qty;

    await cart.save();
    await cart.populate("items.productId");

    return res.json({ success: true, message: "Cart updated", cart });

  } catch (err) {
    console.error("Update Cart Error:", err);
    return res.status(500).json({ success: false, message: "Failed to update cart", error: err.message });
  }
});

// ================== REMOVE ITEM ==================
router.delete("/remove/:productId", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    let cart = await getOrCreateCart(userId);

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    await cart.populate("items.productId");

    return res.json({ success: true, message: "Item removed", cart });

  } catch (err) {
    console.error("Remove Item Error:", err);
    return res.status(500).json({ success: false, message: "Failed to remove item", error: err.message });
  }
});

// ================== CLEAR CART ==================
router.delete("/clear", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await getOrCreateCart(userId);

    cart.items = [];
    await cart.save();

    return res.json({ success: true, message: "Cart cleared", cart });

  } catch (err) {
    console.error("Clear Cart Error:", err);
    return res.status(500).json({ success: false, message: "Failed to clear cart", error: err.message });
  }
});

export default router;
