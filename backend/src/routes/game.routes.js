import { Router } from "express";
import { requireAuth, syncUser } from "../middlewares/auth.middleware.js";
import { createGame, getAllGames, getGameById } from "../controllers/game.controller.js";

const router = Router();

router.get("/", getAllGames);
router.post("/", requireAuth, syncUser, createGame);        // ← added syncUser
router.get("/:id", requireAuth, syncUser, getGameById);    // ← added syncUser

export default router;
