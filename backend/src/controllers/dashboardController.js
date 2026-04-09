const User = require("../models/User");
const LearningPath = require("../models/LearningPath");
const Resource = require("../models/Resource");
const Progress = require("../models/Progress");
const PlatformStat = require("../models/PlatformStat");
const Message = require("../models/Message");
const Announcement = require("../models/Announcement");
const asyncHandler = require("../utils/asyncHandler");

function computePathProgress(pathDoc, progressDocs) {
  if (!pathDoc || !pathDoc.modules.length) {
    return 0;
  }
  if (!progressDocs.length) {
    return 0;
  }
  const total = progressDocs.reduce((sum, item) => sum + (item.pct || 0), 0);
  return Math.round(total / pathDoc.modules.length);
}

const getStudentDashboard = asyncHandler(async (req, res) => {
  const student = req.user;
  const teacher = student.teacher ? await User.findById(student.teacher).select("-password") : null;
  const learningPath = teacher ? await LearningPath.findOne({ teacher: teacher._id }) : null;
  const progress = learningPath ? await Progress.find({ student: student._id, path: learningPath._id }) : [];
  const platform = await PlatformStat.findOne({ student: student._id });
  const announcements = teacher ? await Announcement.find({ from: teacher._id }).sort({ createdAt: -1 }) : [];
  const overallProgress = computePathProgress(learningPath, progress);
  const totalTime = progress.reduce((sum, item) => sum + (item.timeSpent || 0), 0);

  res.json({
    teacher,
    learningPath,
    progress,
    platform,
    announcements,
    overallProgress,
    totalTime,
  });
});

const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;
  const students = await User.find({ role: "student", teacher: teacherId }).select("-password");
  const paths = await LearningPath.find({ teacher: teacherId });
  const resources = await Resource.find({ uploadedBy: teacherId });
  const announcements = await Announcement.find({ from: teacherId }).sort({ createdAt: -1 });
  const unreadMessages = await Message.countDocuments({ to: teacherId, read: false });
  const platformStats = await PlatformStat.find({ student: { $in: students.map((student) => student._id) } });
  const allProgress = await Progress.find({ student: { $in: students.map((student) => student._id) } });
  const primaryPath = paths[0] || null;

  const studentOverview = students.map((student) => {
    const studentProgress = primaryPath
      ? allProgress.filter((item) => String(item.student) === String(student._id) && String(item.path) === String(primaryPath._id))
      : [];
    const platform = platformStats.find((item) => String(item.student) === String(student._id));
    const lastRecord = allProgress
      .filter((item) => String(item.student) === String(student._id))
      .sort((a, b) => String(b.lastActive || "").localeCompare(String(a.lastActive || "")))[0];

    return {
      student,
      progress: primaryPath ? computePathProgress(primaryPath, studentProgress) : 0,
      platform,
      unread: 0,
      lastActive: lastRecord?.lastActive || null,
    };
  });

  const avgCompletion = studentOverview.length
    ? Math.round(studentOverview.reduce((sum, item) => sum + item.progress, 0) / studentOverview.length)
    : 0;

  res.json({
    stats: {
      students: students.length,
      learningPaths: paths.length,
      resources: resources.length,
      unreadMessages,
      avgCompletion,
    },
    students: studentOverview,
    announcements,
    paths,
  });
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password");
  const teachers = await User.find({ role: "teacher" }).select("-password");
  const paths = await LearningPath.find();
  const resources = await Resource.find();
  const platforms = await PlatformStat.find().populate("student", "name batch teacher");
  const progress = await Progress.find();

  const studentOverview = students.map((student) => {
    const teacher = teachers.find((item) => String(item._id) === String(student.teacher));
    const studentPlatform = platforms.find((item) => String(item.student._id || item.student) === String(student._id));
    const studentPath = teacher ? paths.find((item) => String(item.teacher) === String(teacher._id)) : null;
    const studentProgress = studentPath
      ? progress.filter((item) => String(item.student) === String(student._id) && String(item.path) === String(studentPath._id))
      : [];

    return {
      student,
      teacher,
      platform: studentPlatform,
      progress: studentPath ? computePathProgress(studentPath, studentProgress) : 0,
      path: studentPath,
    };
  });

  res.json({
    stats: {
      students: students.length,
      teachers: teachers.length,
      learningPaths: paths.length,
      resources: resources.length,
      leetcodeSolved: platforms.reduce((sum, item) => sum + (item.leetcode?.solved || 0), 0),
      skillrackPoints: platforms.reduce((sum, item) => sum + (item.skillrack?.score || 0), 0),
    },
    students: studentOverview,
    teachers: teachers.map((teacher) => ({
      teacher,
      students: students.filter((student) => String(student.teacher) === String(teacher._id)).length,
      paths: paths.filter((pathDoc) => String(pathDoc.teacher) === String(teacher._id)).length,
      resources: resources.filter((resource) => String(resource.uploadedBy) === String(teacher._id)).length,
    })),
  });
});

module.exports = { getStudentDashboard, getTeacherDashboard, getAdminDashboard };
