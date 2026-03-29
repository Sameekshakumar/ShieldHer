const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Toxicity checker using Claude API
const checkToxicity = async (text) => {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 10,
        messages: [{
          role: "user",
          content: `You are a toxicity detector. Reply with ONLY a decimal number between 0 and 1. Nothing else. No explanation. No words. Just the number. 0 = completely safe, 1 = extremely toxic. Message: "${text}"`
        }]
      })
    });
    const data = await res.json();
    const score = parseFloat(data.content[0].text);
    return isNaN(score) ? 0 : score;
  } catch (err) {
    console.error("Toxicity check failed:", err);
    return 0; // default to safe if API fails
  }
};

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new post
router.post('/', async (req, res) => {
  try {
    // Only check toxicity if post has content and is long enough
    if (req.body.content && req.body.content.length > 10) {
      const score = await checkToxicity(req.body.content);
      if (score > 0.8) {
        return res.status(400).json({ 
          message: "This post violates community guidelines." 
        });
      }
    }

    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;