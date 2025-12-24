import rateLimit from "express-rate-limit";

/**
 * Rate limiter configurations for different endpoints
 */

// General rate limiter for all endpoints
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for URL creation
export const createUrlLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 URL creations per hour
    message: {
        error: "Too many URLs created from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all requests
});

// More lenient rate limiter for redirects (high traffic expected)
export const redirectLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // Limit each IP to 60 redirects per minute
    message: {
        error: "Too many redirect requests, please slow down.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for analytics endpoint
export const analyticsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 analytics requests per 15 minutes
    message: {
        error: "Too many analytics requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
