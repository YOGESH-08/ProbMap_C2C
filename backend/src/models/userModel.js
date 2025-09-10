import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, 
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    numIssueRaised:{
        type:Number,
        default:0,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
