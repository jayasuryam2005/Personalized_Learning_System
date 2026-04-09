const mongoose = require("mongoose");

const roadmapStepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    duration: { type: String, trim: true },
    resources: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
  },
  { _id: true }
);

const roadmapSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    goal: { type: String, trim: true },
    color: { type: String, default: "#6366f1" },
    steps: { type: [roadmapStepSchema], default: [] },
  },
  { timestamps: true }
);

roadmapSchema.index({ student: 1, teacher: 1 }, { unique: true });

module.exports = mongoose.model("Roadmap", roadmapSchema);
