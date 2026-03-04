import mongoose from "mongoose";

const SchemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    officialUrl: {
      type: String,
    },

    benefits: [
      {
        type: String,
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    applicationProcess: {
      mode: {
        type: String,
        enum: ["Online", "Offline", "Both"],
        required: true,
      },
      steps: [
        {
          type: String,
        },
      ],
      onlineLink: { type: String },
    },

    eligibilityQuestions: [
      {
        question: { type: String, required: true },
        field: { type: String, required: true },
        expectedValue: { type: Boolean, required: true },
      },
    ],

    documentsRequired: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Scheme = mongoose.models.Scheme || mongoose.model("Scheme", SchemeSchema);

export default Scheme;
