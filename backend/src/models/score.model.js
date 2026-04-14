import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: "" },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    word: { type: String, required: true },
    score: { type: Number, required: true },       // numeric performance score
    won: { type: Boolean, required: true },
    timeLeft: { type: Number, default: 0 },        // seconds remaining
    attemptsLeft: { type: Number, default: 0 },    // wrong guesses remaining
    timeTaken: { type: Number, default: 0 },       // seconds taken
  },
  { timestamps: true }
);

export const Score = mongoose.model("Score", scoreSchema);
