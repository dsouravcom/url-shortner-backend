import { Router } from "express";
const router = Router();
import Url from "../models/url.js";
import { nanoid } from "nanoid";
import logger from "../logger.js";

// Url Shortener route
router.post("/short", async (req, res) => {
  const { url } = req.body;
  const short_url = nanoid(8);

  if (!url) return res.status(400).json({ error: "Url is required" });

  await Url.create({
    original_url: url,
    short_url: short_url,
    visit_history: [],
  })
    .then(() => {
      res.json({short_url, url});
      logger.info("Url shortened successfully");
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      logger.error("Error shortening url", err);
    });
});

// Url Redirect route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  await Url.findOneAndUpdate(
    { short_url: id },
    { $push: { visit_history: {timeStamp: Date.now()} } }
  )
    .then((url) => {
      if (!url) return res.status(404).json({ error: "Url not found" });
      res.redirect(url.original_url);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      logger.error("Error redirecting to url", err);
    });
});

// Url analytics route
router.get("/analytics/:id", async (req, res) => {
  const { id } = req.params;
  await Url.findOne({ short_url: id })
    .then((url) => {
      if (!url) return res.status(404).json({ error: "Url not found" });
      res.json({"totalView":url.visit_history.length, "analytics": url.visit_history});
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      logger.error("Error fetching url analytics", err);
    });
  });

export default router;
