import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userName: String,
    userAvatar: String,

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      set: (v) => Math.round(v * 10) / 10,
    },

    comment: String,

    images: { type: [String], default: [] },

    likes: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    dislikes: { type: [mongoose.Schema.Types.ObjectId], default: [] },

    isVerifiedPurchase: { type: Boolean, default: false },

    reporters: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    reportCount: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false },

    isEdited: { type: Boolean, default: false },
    editedAt: Date,
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

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10,
    },
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
