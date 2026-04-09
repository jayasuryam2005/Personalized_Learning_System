const Roadmap = require("../models/Roadmap");
const asyncHandler = require("../utils/asyncHandler");

const getRoadmaps = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.studentId) {
    filter.student = req.query.studentId;
  }
  if (req.query.teacherId) {
    filter.teacher = req.query.teacherId;
  }

  const roadmaps = await Roadmap.find(filter)
    .populate("student", "name email batch")
    .populate("teacher", "name email subject");

  res.json(roadmaps);
});

const upsertRoadmap = asyncHandler(async (req, res) => {
  const { studentId, title, goal, color, steps } = req.body;

  if (!studentId || !title || !Array.isArray(steps)) {
    res.status(400);
    throw new Error("studentId, title, and steps are required.");
  }

  const roadmap = await Roadmap.findOneAndUpdate(
    { student: studentId, teacher: req.user._id },
    {
      $set: {
        title,
        goal,
        color,
        steps,
        student: studentId,
        teacher: req.user._id,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .populate("student", "name email batch")
    .populate("teacher", "name email subject");

  res.json(roadmap);
});

module.exports = { getRoadmaps, upsertRoadmap };
