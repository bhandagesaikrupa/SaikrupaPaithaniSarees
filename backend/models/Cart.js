


import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1, min: 1 }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  sessionId: { type: String, default: null },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate total before saving
cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

export default mongoose.model("Cart", cartSchema);

