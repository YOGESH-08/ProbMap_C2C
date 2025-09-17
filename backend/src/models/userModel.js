import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUID: {
      type: String,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    loginMethod: {
      type: String,
      enum: ["google", "email"],
      default: "email",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: {
      type: [String],
      default: [],
    },
    numIssueRaised: {
      type: Number,
      default: 0,
    },
    // Volunteer fields
    isVolunteer: {
      type: Boolean,
      default: false,
    },
    volunteerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "none"],
      default: "none",
    },
    volunteerPoints: {
      type: Number,
      default: 0,
    },
    volunteerSince: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
