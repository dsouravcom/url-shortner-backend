import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const blacklistedDomains = ["l2s.is"];

const urlSchema = z.object({
    url: z.url({ message: "Invalid URL format" }),
});

const urlValidator = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate using Zod
        const { url } = urlSchema.parse(req.body);

        // Check blacklisted domains
        const parsedUrl = new URL(url);
        if (blacklistedDomains.includes(parsedUrl.hostname)) {
            return res.status(400).json({ error: "URL domain is blacklisted" });
        }

        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.issues[0].message });
        }
        return res.status(400).json({ error: "Invalid URL format" });
    }
};

export default urlValidator;
