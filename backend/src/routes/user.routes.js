import { Router } from "express";
import passport from "../config/passport.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { googleAuthCallback } from "../controllers/google.controller.js";

const router = Router();

// ─── Standard Auth ────────────────────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authenticateUser, getCurrentUser);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// Step 1: Redirect user to Google's login screen
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google redirects back here after user consents
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/failure`,
  }),
  googleAuthCallback
);

export default router;
