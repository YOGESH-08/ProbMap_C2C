import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    imageUrl: { type: String },

    status: { 
      type: String, 
      enum: ["pending", "acknowledged", "rejected", "resolved"], 
      default: "pending" 
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    userId: {
      type: String, 
      required: true,
    },

    adminResponse: {
      message: { type: String },
      respondedBy: { type: String }, 
      respondedAt: { type: Date },
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
