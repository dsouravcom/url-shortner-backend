import { Request, Response } from "express";
import * as urlService from "../services/url.service";
import logger from "../utils/Logger";

/**
 * Controller for URL shortening
 */
export const shortenUrl = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        const result = await urlService.createShortUrl(url);

        if (result.success) {
            logger.info(
                `URL shortened successfully: ${url} -> ${result.data.short_url}`
            );
            return res.status(201).json(result.data);
        }

        return res.status(500).json({ error: "Failed to create short URL" });
    } catch (error) {
        logger.error("Error shortening URL", error);

        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Controller for URL redirection
 */
export const redirectUrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Short URL ID is required" });
        }

        const result = await urlService.recordVisit(id);

        if (!result.success || !result.data) {
            return res
                .status(404)
                .json({ error: result.error || "URL not found" });
        }

        return res.redirect(result.data);
    } catch (error) {
        logger.error("Error redirecting to URL", error);

        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Controller for URL analytics
 */
export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Short URL ID is required" });
        }

        const result = await urlService.getUrlAnalytics(id);

        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        return res.json(result.data);
    } catch (error) {
        logger.error("Error fetching URL analytics", error);

        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Controller for redirecting to main website
 */
export const redirectToMainSite = (req: Request, res: Response) => {
    res.redirect(301, "https://www.sorti.in");
};
