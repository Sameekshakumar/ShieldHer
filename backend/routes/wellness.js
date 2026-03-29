const authMiddleware = require('../middleware/auth');
const router = express.Router();
const jwt = require("jsonwebtoken");
const MoodLog = require("../models/MoodLog");


// POST /api/wellness/log-mood
router.post("/log-mood", authMiddleware, async (req, res) => {
  const pseudonym = req.user.pseudonym;
  if (!pseudonym) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { moodScore } = req.body;
  if (!moodScore || moodScore < 1 || moodScore > 5) {
    return res.status(400).json({ error: "Mood score must be between 1 and 5." });
  }

  try {
    // Call Claude API for wellness nudge
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: `A teenage girl is using a safety app. She just saw a toxic message get blocked. She rated her mood as ${moodScore}/5 where 1 is very distressed and 5 is completely fine. Write a warm, empowering 2-sentence message to support her. Be gentle, positive, and age-appropriate.`,
          },
        ],
      }),
    });

    const claudeData = await claudeResponse.json();
    const aiNudge = claudeData.content[0].text;

    // Save mood log to MongoDB
    const log = await MoodLog.create({
      pseudonym,
      moodScore,
      aiNudge,
      timestamp: new Date(),
    });

    return res.json({ aiNudge, moodScore, timestamp: log.timestamp });
  } catch (err) {
    console.error("Wellness log error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// GET /api/wellness/history
router.get("/history", authMiddleware, async (req, res) => {
  const pseudonym = req.user.pseudonym;
  if (!pseudonym) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
    const logs = await MoodLog.find({ pseudonym })
      .sort({ timestamp: -1 })
      .limit(10);

    return res.json({ logs });
  } catch (err) {
    console.error("History fetch error:", err);
    return res.status(500).json({ error: "Could not fetch history." });
  }
});

module.exports = router;