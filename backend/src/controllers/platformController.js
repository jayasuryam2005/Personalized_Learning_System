const PlatformStat = require("../models/PlatformStat");
const asyncHandler = require("../utils/asyncHandler");

const getPlatforms = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.studentId) {
    filter.student = req.query.studentId;
  }

  const platforms = await PlatformStat.find(filter).populate("student", "name email batch teacher");
  res.json(platforms);
});

const updatePlatform = asyncHandler(async (req, res) => {
  if (req.user.role === "student" && String(req.user._id) !== String(req.params.studentId)) {
    res.status(403);
    throw new Error("Students can update only their own coding profiles.");
  }

  const platform = await PlatformStat.findOneAndUpdate(
    { student: req.params.studentId },
    { $set: req.body },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json(platform);
});

module.exports = { getPlatforms, updatePlatform };
