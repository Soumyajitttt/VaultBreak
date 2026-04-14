import { Game } from "../models/game.model.js";
import { User } from "../models/user.model.js";

// POST /api/games — create a game
export const createGame = async (req, res) => {
  try {
    const { word, hint } = req.body;
    if (!word || !hint) return res.status(400).json({ error: "Word and hint are required" });
    if (word.length < 2) return res.status(400).json({ error: "Word must be at least 2 characters" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found. Try signing out and back in." });

    const game = await Game.create({
      word: word.trim().toUpperCase(),
      hint: hint.trim(),
      createdBy: req.userId,
      creatorName: user.fullname || user.username,
      creatorAvatar: user.avatar || "",
    });

    res.status(201).json({ message: "Game created!", game });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/games — get all games
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    // Hide the actual word from the response — only send word length
    const sanitized = games.map((g) => ({
      _id: g._id,
      hint: g.hint,
      wordLength: g.word.length,
      createdBy: g.createdBy,
      creatorName: g.creatorName,
      creatorAvatar: g.creatorAvatar,
      playCount: g.playCount,
      createdAt: g.createdAt,
    }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/games/:id — get single game to play (with word, authenticated)
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    // Increment play count
    game.playCount += 1;
    await game.save();

    res.json(game);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
