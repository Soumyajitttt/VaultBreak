import { Router } from "express";
import { requireAuth, syncUser } from "../middlewares/auth.middleware.js";
import { submitScore, getLeaderboard, getPlayedGameIds } from "../controllers/score.controller.js";

const router = Router();

// Fix: Remove the spread operator (...)
router.post("/", requireAuth, syncUser, submitScore); 
router.get("/leaderboard", getLeaderboard);
router.get("/played", requireAuth, getPlayedGameIds);

export default router;
