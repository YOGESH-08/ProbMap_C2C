import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    enum: ["pothole", "garbage", "streetlight", "waterlogging", "other"], 
    default: "other" 
  },
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  imageUrl: String,
  status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Issue", issueSchema);
