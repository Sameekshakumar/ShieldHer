const mongoose = require("mongoose");

const moodLogSchema = new mongoose.Schema({
  pseudonym: {
    type: String,
    required: [true, "Pseudonym is required"],
    trim: true,
  },
  moodScore: {
    type: Number,
    required: [true, "Mood score is required"],
    min: [1, "Mood score must be between 1 and 5"],
    max: [5, "Mood score must be between 1 and 5"],
  },
  aiNudge: {
    type: String,
    default: "",
    maxlength: [500, "AI nudge cannot exceed 500 characters"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MoodLog", moodLogSchema);
