import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], default: [] },
   description: { type: String, default: "" },
  status: { type: String, enum: ["active", "out-of-stock"], default: "active" },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
