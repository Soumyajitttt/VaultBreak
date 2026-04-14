import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { createGame, getAllGames, getGameById } from "../controllers/game.controller.js";

const router = Router();

router.get("/", getAllGames);                        // public
router.post("/", requireAuth, createGame);          // auth required
router.get("/:id", requireAuth, getGameById);       // auth required (to get word)

export default router;
