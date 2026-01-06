import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "seller" },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, default: "credentials" },
    avatar: { type: String, default: "" },

    storeName: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    verified: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String, default: "India" },
    },
  },
  { timestamps: true }
);

const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
