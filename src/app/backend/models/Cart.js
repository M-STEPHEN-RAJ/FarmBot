import mongoose from "mongoose";

// Each item in the cart
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: { type: String, required: true },
    description: String,

    category: { type: String, required: true },
    type: { type: String, required: true },

    image: String,

    price: { type: Number, required: true },
    unit: String,

    quantity: { type: Number, required: true, min: 1, default: 1 },
    
    isOutOfStock: { type: Boolean, default: false },
    stock: { type: Number, required: true },

    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Main cart schema
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "ordered"],
      default: "active",
    },

    coupon: {
      code: String,
      discount: Number,
      appliedAt: Date,
    },

    shippingAddress: String,
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;