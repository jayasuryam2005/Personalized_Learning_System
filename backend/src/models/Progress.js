const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    path: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath", required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    pct: { type: Number, default: 0, min: 0, max: 100 },
    timeSpent: { type: Number, default: 0 },
    lastActive: { type: String, trim: true },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, path: 1, moduleId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
