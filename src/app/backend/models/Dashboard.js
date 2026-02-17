import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    harvestDays: {
      type: Number,
      required: true,
    },

    health: {
      plantName: String,
      result: String,
      confidence: Number,
      predictedAt: Date,
    },

    heatmap: [
      {
        year: {
          type: Number,
          required: true,
        },
        days: [
          {
            date: {
              type: Date,
              required: true,
            },
            status: {
              type: String,
              enum: ["past", "today", "future"],
              required: true,
            },
          },
        ],
      },
    ],

    todayAdvice: {
      content: String,

      generatedForDate: {
        type: Date,
        index: true,
      },

      generatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { _id: false }
);

const dashboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true,
    },

    crops: [cropSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Dashboard ||
  mongoose.model("Dashboard", dashboardSchema);