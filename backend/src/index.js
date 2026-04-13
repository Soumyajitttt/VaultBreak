import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 Routes:`);
    console.log(`   POST   /api/users/register`);
    console.log(`   POST   /api/users/login`);
    console.log(`   POST   /api/users/logout`);
    console.log(`   POST   /api/users/refresh-token`);
    console.log(`   GET    /api/users/me`);
    console.log(`   GET    /api/users/auth/google`);
    console.log(`   GET    /api/users/auth/google/callback`);
  });
});
