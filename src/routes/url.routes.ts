import { Router } from "express";
import {
    analyticsLimiter,
    createUrlLimiter,
    redirectLimiter,
} from "../config/rateLimiter";
import * as urlController from "../controllers/url.controller";
import urlValidator from "../middlewares/urlValidator.middleware";

const router = Router();

// Url Shortener route with strict rate limiting
router.post("/short", createUrlLimiter, urlValidator, urlController.shortenUrl);

// Url analytics route with moderate rate limiting
router.get("/analytics/:id", analyticsLimiter, urlController.getAnalytics);

// Url Redirect route with lenient rate limiting (high traffic expected)
router.get("/:id", redirectLimiter, urlController.redirectUrl);

// Redirect to the main website
router.get("/", urlController.redirectToMainSite);

export default router;
