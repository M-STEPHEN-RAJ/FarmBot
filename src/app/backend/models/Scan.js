import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true },
  plantName:{ type: String, required: true },
  prediction: { type: String, required: true },
  confidence: { type: Number, required: true },
  explanation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Scan = mongoose.models.Scan || mongoose.model("Scan", ScanSchema);
export default Scan;
