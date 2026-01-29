import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },

  name: String,
  image: String,

  category: String,
  type: String,

  price: Number,
  unit: String,
  quantity: Number,

  status: {
    type: String,
    enum: [
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned",
    ],
    default: "confirmed",
  },

  delivery: {
    estimatedDate: Date,
    shippedAt: Date,
    outForDeliveryAt: Date,
    deliveredAt: Date,

    courier: String,
    trackingId: String,
  },

  cancelledAt: Date,
  cancelReason: String,

  returnStatus: {
    type: String,
    enum: ["none", "requested", "approved", "picked", "refunded"],
    default: "none",
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalItems: Number,
    totalPrice: Number,

    deliveryFee: {
      type: Number,
      default: 0,
    },

    payment: {
      method: {
        type: String,
        enum: ["COD", "UPI", "CARD"],
        default: "COD",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      transactionId: String,
    },

    shippingAddress: {
      name: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },

    orderStatus: {
      type: String,
      enum: ["placed", "completed", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
