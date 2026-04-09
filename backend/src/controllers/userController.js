const User = require("../models/User");
const PlatformStat = require("../models/PlatformStat");
const Message = require("../models/Message");
const Progress = require("../models/Progress");
const Resource = require("../models/Resource");
const Roadmap = require("../models/Roadmap");
const Announcement = require("../models/Announcement");
const LearningPath = require("../models/LearningPath");
const asyncHandler = require("../utils/asyncHandler");
const { buildDefaultPlatform } = require("../utils/platformDefaults");

const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) {
    filter.role = req.query.role;
  }
  if (req.query.teacherId) {
    filter.teacher = req.query.teacherId;
  }

  const users = await User.find(filter)
    .select("-password")
    .populate("teacher", "name email role subject");

  res.json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, subject, teacherId, batch } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Name, email, password, and role are required.");
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error("Email already exists.");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    subject: role === "teacher" ? subject : undefined,
    teacher: role === "student" && teacherId ? teacherId : undefined,
    batch: role === "student" ? batch : undefined,
    avatar: name.charAt(0).toUpperCase(),
  });

  if (role === "student") {
    await PlatformStat.create(buildDefaultPlatform(user._id));
  }

  const safeUser = await User.findById(user._id).select("-password").populate("teacher", "name email role subject");
  res.status(201).json(safeUser);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const teacherPaths = user.role === "teacher" ? await LearningPath.find({ teacher: user._id }).select("_id") : [];
  const teacherPathIds = teacherPaths.map((item) => item._id);

  await Promise.all([
    User.deleteOne({ _id: user._id }),
    Message.deleteMany({ $or: [{ from: user._id }, { to: user._id }] }),
    Progress.deleteMany(
      user.role === "teacher"
        ? { $or: [{ student: user._id }, { path: { $in: teacherPathIds } }] }
        : { student: user._id }
    ),
    PlatformStat.deleteMany({ student: user._id }),
    Roadmap.deleteMany({ $or: [{ student: user._id }, { teacher: user._id }] }),
    Announcement.deleteMany({ from: user._id }),
    user.role === "teacher" ? LearningPath.deleteMany({ teacher: user._id }) : Promise.resolve(),
    user.role === "teacher"
      ? Resource.deleteMany({ $or: [{ uploadedBy: user._id }, { path: { $in: teacherPathIds } }] })
      : Promise.resolve(),
  ]);

  if (user.role === "teacher") {
    await User.updateMany({ teacher: user._id }, { $unset: { teacher: 1 } });
  }

  res.json({ message: "User deleted successfully." });
});

module.exports = { getUsers, createUser, deleteUser };
