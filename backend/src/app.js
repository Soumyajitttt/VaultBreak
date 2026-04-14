import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./utils/inngest.js";


const app= express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,  
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(clerkMiddleware());

//routes
import userRoutes from "./routes/user.routes.js";


app.use("/api/v1.0.0/users", userRoutes);
app.use("/api/inngest", serve({ client: inngest, functions }));



export default app;