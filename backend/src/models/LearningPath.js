const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    hours: { type: Number, default: 0 },
    order: { type: Number, required: true },
  },
  { _id: true }
);

const learningPathSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    totalHours: { type: Number, default: 0 },
    color: { type: String, default: "#6366f1" },
    emoji: { type: String, default: "📚" },
    modules: { type: [moduleSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningPath", learningPathSchema);
