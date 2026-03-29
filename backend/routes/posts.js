const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.pseudonym = decoded.pseudonym;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// POST /api/posts/check-and-send
router.post("/check-and-send", verifyToken, async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  try {
    // Call Google Perspective API
    const perspectiveRes = await fetch(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: { text: content },
          requestedAttributes: { TOXICITY: {} },
        }),
      }
    );

    const perspectiveData = await perspectiveRes.json();
    const score =
      perspectiveData.attributeScores.TOXICITY.summaryScore.value;

    const wasBlocked = score > 0.7;

    const post = new Post({
      authorPseudonym: req.pseudonym,
      content,
      toxicityScore: score,
      wasBlocked,
      timestamp: new Date(),
    });
    await post.save();

    if (wasBlocked) {
      return res.json({
        blocked: true,
        score,
        message: "This message was intercepted",
      });
    }

    return res.json({ blocked: false, score, post });
  } catch (err) {
    console.error("Perspective API error:", err);
    return res.status(500).json({ error: "Toxicity check failed" });
  }
});

// GET /api/posts/feed
router.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find({ wasBlocked: false })
      .sort({ timestamp: -1 })
      .lean();
    return res.json(posts);
  } catch (err) {
    console.error("Feed fetch error:", err);
    return res.status(500).json({ error: "Could not load feed" });
  }
});

module.exports = router;