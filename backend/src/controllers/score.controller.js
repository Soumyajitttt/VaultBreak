import { Score } from "../models/score.model.js";
import { User } from "../models/user.model.js";

// POST /api/scores — submit score
export const submitScore = async (req, res) => {
  try {
    const { gameId, word, won, timeLeft, attemptsLeft, timeTaken } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const score = won
      ? Math.round(1000 + timeLeft * 5 + attemptsLeft * 100)
      : 0;

    const entry = await Score.create({
      userId: req.userId,
      username: user.username || user.fullname,
      avatar: user.avatar || "",
      gameId,
      word,
      score,
      won,
      timeLeft,
      attemptsLeft,
      timeTaken,
    });

    res.status(201).json({ score: entry.score, entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/scores/leaderboard — global leaderboard (top score per user)
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          avatar: { $first: "$avatar" },
          totalScore: { $sum: "$score" },
          gamesPlayed: { $sum: 1 },
          gamesWon: { $sum: { $cond: ["$won", 1, 0] } },
          bestScore: { $max: "$score" },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 50 },
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/scores/played — get all game IDs the current user has already played
export const getPlayedGameIds = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.userId }).select("gameId");
    const gameIds = scores.map((s) => s.gameId.toString());
    res.json(gameIds);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};