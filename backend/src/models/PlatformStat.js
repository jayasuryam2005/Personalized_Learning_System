const mongoose = require("mongoose");

const platformStatSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    leetcode: {
      solved: { type: Number, default: 0 },
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
    },
    skillrack: {
      score: { type: Number, default: 0 },
      problems: { type: Number, default: 0 },
      badge: { type: String, default: "Bronze" },
    },
    codechef: {
      rating: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
    },
    codingProfiles: {
      leetcodeUsername: { type: String, default: "" },
      skillrackUrl: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlatformStat", platformStatSchema);
