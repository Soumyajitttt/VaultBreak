import { Router } from "express";
import { requireAuth, syncUser } from "../middlewares/auth.middleware.js";
import { submitScore, getLeaderboard } from "../controllers/score.controller.js";

const router = Router();

router.post("/", requireAuth, syncUser, submitScore);    // ← added syncUser
router.get("/leaderboard", getLeaderboard);

export default router;
