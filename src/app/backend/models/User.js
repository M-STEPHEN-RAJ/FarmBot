import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    name: { type: String },
    role: { type: String, default: "user" }, 
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, default: "credentials" },
    avatar: { type: String, default: "" },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;