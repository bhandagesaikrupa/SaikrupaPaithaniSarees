// routes/cart.js
import express from "express";
import Cart from "../models/Cart.js";
const router = express.Router();

// Get cart items (assume single cart for simplicity)
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne();
    if (!cart) cart = await Cart.create({ items: [] });
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart (allow duplicates)
router.post("/", async (req, res) => {
  const { productId, name, image, price, quantity } = req.body;

  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ items: [] });
    }

    // Add as new item, even if product exists
    cart.items.push({ productId, name, image, price, quantity });
    await cart.save();

    res.status(201).json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: Remove a single item by _id
router.delete("/:itemId", async (req, res) => {
  const { itemId } = req.params;
  try {
    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
