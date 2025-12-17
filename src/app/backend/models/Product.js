import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    userAvatar: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,

    category: { type: String, required: true },
    type: { type: String, required: true },

    price: { type: Number, required: true },
    unit: String,

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    reviews: [reviewSchema],

    stock: { type: Number, default: 0 },
    image: String,

    popularity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
