const Progress = require("../models/Progress");
const asyncHandler = require("../utils/asyncHandler");

const getProgress = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.studentId) {
    filter.student = req.query.studentId;
  }
  if (req.query.pathId) {
    filter.path = req.query.pathId;
  }

  const progress = await Progress.find(filter).populate("path", "title modules");
  res.json(progress);
});

const upsertProgress = asyncHandler(async (req, res) => {
  const { studentId, pathId, moduleId, pct, timeSpent } = req.body;

  if (!studentId || !pathId || !moduleId) {
    res.status(400);
    throw new Error("studentId, pathId, and moduleId are required.");
  }

  if (req.user.role === "student" && String(req.user._id) !== String(studentId)) {
    res.status(403);
    throw new Error("Students can update only their own progress.");
  }

  const today = new Date().toISOString().split("T")[0];
  const progress = await Progress.findOneAndUpdate(
    { student: studentId, path: pathId, moduleId },
    {
      $set: {
        pct: Number(pct) || 0,
        lastActive: today,
        ...(timeSpent !== undefined ? { timeSpent: Number(timeSpent) || 0 } : {}),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json(progress);
});

module.exports = { getProgress, upsertProgress };
