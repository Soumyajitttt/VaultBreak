import { Router } from "express";
import { requireAuth, syncUser } from "../middlewares/auth.middleware.js";
import { createGame, getAllGames, getGameById, getDailyPuzzle } from "../controllers/game.controller.js";

const router = Router();

router.get("/", getAllGames);
router.get("/daily", requireAuth, getDailyPuzzle);      // daily puzzle
router.post("/", requireAuth, syncUser, createGame);
router.get("/:id", requireAuth, syncUser, getGameById);

export default router;