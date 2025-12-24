import { nanoid } from "nanoid";
import Url from "../models/url.model";

/**
 * Service layer for URL operations
 */

export const createShortUrl = async (originalUrl: string) => {
    try {
        const shortUrl = nanoid(8);

        const url = await Url.create({
            original_url: originalUrl,
            short_url: shortUrl,
            visit_history: [],
        });

        return {
            success: true,
            data: {
                short_url: url.short_url,
                original_url: url.original_url,
            },
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create short URL: ${error.message}`);
        }
        throw new Error("Failed to create short URL: Unknown error");
    }
};

export const getOriginalUrl = async (shortUrl: string) => {
    try {
        // Use lean() for faster query - returns plain JavaScript object instead of Mongoose document
        const url = await Url.findOne({ short_url: shortUrl }).lean().exec();

        if (!url) {
            return {
                success: false,
                error: "URL not found",
            };
        }

        return {
            success: true,
            data: url.original_url,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve URL: ${error.message}`);
        }
        throw new Error("Failed to retrieve URL: Unknown error");
    }
};

export const recordVisit = async (shortUrl: string) => {
    try {
        // Select only the original_url field for better performance
        const url = await Url.findOneAndUpdate(
            { short_url: shortUrl },
            { $push: { visit_history: { timeStamp: Date.now() } } },
            { new: true, lean: true, select: 'original_url' }
        ).exec();

        if (!url) {
            return {
                success: false,
                error: "URL not found",
            };
        }

        return {
            success: true,
            data: url.original_url,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to record visit: ${error.message}`);
        }
        throw new Error("Failed to record visit: Unknown error");
    }
};

export const getUrlAnalytics = async (shortUrl: string) => {
    try {
        // Use lean() and select only needed fields for optimal performance
        const url = await Url.findOne({ short_url: shortUrl })
            .select('visit_history')
            .lean()
            .exec();

        if (!url) {
            return {
                success: false,
                error: "URL not found",
            };
        }

        return {
            success: true,
            data: {
                totalView: url.visit_history.length,
                analytics: url.visit_history,
            },
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get analytics: ${error.message}`);
        }
        throw new Error("Failed to get analytics: Unknown error");
    }
};
