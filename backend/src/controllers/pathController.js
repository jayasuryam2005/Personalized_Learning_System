const LearningPath = require("../models/LearningPath");
const asyncHandler = require("../utils/asyncHandler");

const getPaths = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.teacherId) {
    filter.teacher = req.query.teacherId;
  }

  const paths = await LearningPath.find(filter).populate("teacher", "name email subject");
  res.json(paths);
});

const createPath = asyncHandler(async (req, res) => {
  const { title, description, totalHours, color, emoji, modules } = req.body;

  if (!title || !Array.isArray(modules) || modules.length === 0) {
    res.status(400);
    throw new Error("Title and at least one module are required.");
  }

  const learningPath = await LearningPath.create({
    teacher: req.user._id,
    title,
    description,
    totalHours: Number(totalHours) || 0,
    color,
    emoji,
    modules: modules.map((moduleItem, index) => ({
      title: moduleItem.title,
      hours: Number(moduleItem.hours) || 0,
      order: moduleItem.order || index + 1,
    })),
  });

  const populated = await LearningPath.findById(learningPath._id).populate("teacher", "name email subject");
  res.status(201).json(populated);
});

module.exports = { getPaths, createPath };
