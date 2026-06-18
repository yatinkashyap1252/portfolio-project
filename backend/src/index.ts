import dotenv from "dotenv";
// Load env before other imports to ensure values are read
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { mongoInjectionSelector, xssSanitizer } from "./middleware/security";
import { apiLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth";
import cmsRoutes from "./routes/cms";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Trust Proxy for proxy servers (Heroku, AWS ELB, Nginx, etc.)
// Required for express-rate-limit to extract client IP correctly
app.set("trust proxy", 1);

// Global Security Headers (Helmet)
app.use(helmet());

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // Allow cookies to be sent across domains
    optionsSuccessStatus: 200,
  })
);

// Body and Cookie Parsers
app.use(express.json({ limit: "10mb" })); // Limit body sizes to prevent DoS for large base64 uploads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Custom Security Middleware Filters
app.use(mongoInjectionSelector);
app.use(xssSanitizer);

// General Traffic Throttler
app.use("/api/", apiLimiter);

// API Status Route (Public check)
app.get("/api/v1/status", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Authentication Routes
app.use("/api/v1/auth", authRoutes);

// CMS Content Routes
app.use("/api/v1/cms", cmsRoutes);

// Catch-all 404 Route
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global Error Exception Handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Portfolio CMS Server is listening on port ${PORT}`);
});
