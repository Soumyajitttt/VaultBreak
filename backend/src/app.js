import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session is needed briefly for the OAuth handshake
// even though we use session: false on the callback
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 1000, // 1 minute — just long enough for the OAuth round-trip
    },
  })
);

// ─── Passport ─────────────────────────────────────────────────────────────────
app.use(passport.initialize());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/users", userRouter);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
