import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    imageUrl: { type: String },
    status: { type: String, default: "pending" },
}, { timestamps: true });

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
