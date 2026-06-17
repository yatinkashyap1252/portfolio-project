import rateLimit from "express-rate-limit";

// Throttling for all normal API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Throttling strictly on authentication paths (login, 2fa check, setup)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many authentication attempts. Account access is temporarily throttled. Please try again after 15 minutes.",
  },
});
