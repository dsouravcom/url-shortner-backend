import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import connectDB from "./config/database";
import { generalLimiter } from "./config/rateLimiter";
import urlRoutes from "./routes/url.routes";
import type { CorsOriginCallback } from "./types";
dotenv.config();

// Connect to MongoDB with optimized configuration
connectDB();

const app = express();

// Trust proxy for rate limiting (needed when behind a reverse proxy like Nginx or Heroku)
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

// Configure the CORS for whitelisted domains.
const allowedOrigins = process.env.WHITELISTED_DOMAINS;

const corsOptions: import("cors").CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: CorsOriginCallback
    ): void => {
        // Check if the origin is allowed
        if (!origin || (allowedOrigins as string).includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS -> " + origin));
        }
    },
    methods: "POST,GET",
    credentials: true, // Enable credentials (if needed)
    optionsSuccessStatus: 204, // Respond with a 204 status for preflight requests
};

// Apply CORS middleware globally to all routes
app.use((req, res, next) => {
    const excludeRoutes = ["/health"]; // You can include routes that don't use Whitelisted domains.
    if (excludeRoutes.includes(req.path)) {
        cors()(req, res, next);
    } else {
        cors(corsOptions)(req, res, next);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        message: "Server is healthy",
    });
});

// URL routes
app.use("/", urlRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
