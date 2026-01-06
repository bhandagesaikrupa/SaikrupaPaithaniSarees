


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

    // Find and update product stock
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.stock < qty) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} units available in stock` });
    }

    // Decrement stock
    product.stock -= qty;
    await product.save();

    let cart = await getOrCreateCart(userId);

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.productId && item.productId._id.toString() === productId);

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

    return res.json({ success: true, message: "Product added to cart", cart, newStock: product.stock });

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
    const newQty = parseInt(req.body.quantity);

    if (isNaN(newQty) || newQty <= 0) return res.status(400).json({ success: false, message: "Quantity must be positive" });

    let cart = await getOrCreateCart(userId);

    const item = cart.items.find(item => item.productId && item.productId._id.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const qtyDiff = newQty - item.quantity;

    if (qtyDiff > 0) {
      // Increasing quantity - Check stock
      if (product.stock < qtyDiff) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} more units available` });
      }
      product.stock -= qtyDiff;
    } else if (qtyDiff < 0) {
      // Decreasing quantity - Return to stock
      product.stock += Math.abs(qtyDiff);
    }

    item.quantity = newQty;

    await product.save();
    await cart.save();
    await cart.populate("items.productId");

    return res.json({ success: true, message: "Cart updated", cart, newStock: product.stock });

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

    const itemIndex = cart.items.findIndex(item => item.productId && item.productId._id.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not found in cart" });

    // Return stock to product
    const product = await Product.findById(productId);
    if (product) {
      product.stock += cart.items[itemIndex].quantity;
      await product.save();
    }

    cart.items.splice(itemIndex, 1);
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

    // Return all items to stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    cart.items = [];
    await cart.save();

    return res.json({ success: true, message: "Cart cleared", cart });

  } catch (err) {
    console.error("Clear Cart Error:", err);
    return res.status(500).json({ success: false, message: "Failed to clear cart", error: err.message });
  }
});

export default router;
