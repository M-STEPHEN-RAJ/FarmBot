import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "admin" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: { type: String, default: "credentials" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;