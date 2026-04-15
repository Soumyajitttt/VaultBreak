import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./utils/inngest.js";
import gameRoutes from "./routes/game.routes.js";
import scoreRoutes from "./routes/score.routes.js";

const app = express();

app.use(cors({
  origin: "https://vault-break-game.vercel.app/",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(clerkMiddleware());

app.use("/api/games", gameRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

export default app;
