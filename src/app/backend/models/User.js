import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    role: { type: String, default: "user" },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, default: "credentials" },
    avatar: { type: String, default: "" },
    defaultShippingAddress: {
      type: addressSchema,
      default: null,
    },

    addressHistory: { type: [addressSchema], default: [] },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
