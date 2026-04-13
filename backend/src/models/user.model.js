import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Not required — Google users won't have a password
    password: {
      type: String,
    },
    // Google OAuth fields
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving (skip if no password — Google users)
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare plaintext password to hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false; // Google-only accounts have no password
  return await bcrypt.compare(password, this.password);
};

// Generate short-lived access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate long-lived refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
