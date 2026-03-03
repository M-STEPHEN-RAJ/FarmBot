import mongoose from "mongoose";

const SchemeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },

  description: { 
    type: String, 
    required: true 
  },

  imageUrl: {      
    type: String,
    required: true
  },

  officialUrl: { 
    type: String, 
    required: true 
  },

  category: {
    type: String,
    enum: ["Subsidy", "Loan", "Insurance", "Training", "Equipment"],
    required: true
  },

  views: {         
    type: Number,
    default: 0
  },

  isActive: { 
    type: Boolean, 
    default: true 
  },
}, { timestamps: true });

const Scheme =
  mongoose.models.Scheme ||
  mongoose.model("Scheme", SchemeSchema);

export default Scheme;