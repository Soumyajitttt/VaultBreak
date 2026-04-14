import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String }, // Clerk user ID
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
