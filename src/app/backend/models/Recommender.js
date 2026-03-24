import mongoose from "mongoose";

const recommenderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  ph: { type: Number, required: true },
  rainfall: { type: Number, required: true },

  crop: { type: String, required: true },
  explanation: { type: String },

  createdAt: { type: Date, default: Date.now }
});

const Recommender = mongoose.models.Recommender || mongoose.model("Recommender", recommenderSchema);
export default Recommender;