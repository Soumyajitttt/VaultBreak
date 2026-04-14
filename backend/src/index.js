import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";
import { generateDailyPuzzle } from "./utils/daily.js";

const PORT = process.env.PORT || 5000;

const scheduleDailyPuzzle = () => {
  const now = new Date();
  const nextMidnight = new Date();
  nextMidnight.setDate(now.getDate() + 1);
  nextMidnight.setHours(0, 0, 0, 0);

  const msUntilMidnight = nextMidnight - now;

  setTimeout(async () => {
    await generateDailyPuzzle().catch(console.error);
    // Then repeat every 24 hours
    setInterval(() => {
      generateDailyPuzzle().catch(console.error);
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);

  console.log(`Daily puzzle scheduler set. Next run in ${Math.round(msUntilMidnight / 1000 / 60)} minutes.`);
};

connectDB().then(async () => {
  // Generate today's puzzle immediately on startup if it doesn't exist
  await generateDailyPuzzle().catch(console.error);

  // Schedule future puzzles at midnight
  scheduleDailyPuzzle();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start:", err);
});
