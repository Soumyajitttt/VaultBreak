import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { submitScore, getLeaderboard } from "../controllers/score.controller.js";

const router = Router();

router.post("/", requireAuth, submitScore);
router.get("/leaderboard", getLeaderboard);

export default router;
