import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    word: { type: String, required: true, uppercase: true, trim: true },
    hint: { type: String, required: true, trim: true },
    createdBy: { type: String, ref: "User", required: true },
    creatorName: { type: String, required: true },
    creatorAvatar: { type: String, default: "" },
    playCount: { type: Number, default: 0 },
    isDaily: { type: Boolean, default: false },
    dailyDate: { type: String, default: null }, // "YYYY-MM-DD"
  },
  { timestamps: true }
);

export const Game = mongoose.model("Game", gameSchema);