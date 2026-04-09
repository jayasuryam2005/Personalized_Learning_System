const Announcement = require("../models/Announcement");
const asyncHandler = require("../utils/asyncHandler");

const getAnnouncements = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.from) {
    filter.from = req.query.from;
  }

  const announcements = await Announcement.find(filter)
    .populate("from", "name email role subject")
    .sort({ createdAt: -1 });

  res.json(announcements);
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, body, priority } = req.body;

  if (!title || !body) {
    res.status(400);
    throw new Error("Title and body are required.");
  }

  const announcement = await Announcement.create({
    title,
    body,
    priority,
    from: req.user._id,
    date: new Date().toISOString().split("T")[0],
  });

  const populated = await Announcement.findById(announcement._id).populate("from", "name email role subject");
  res.status(201).json(populated);
});

module.exports = { getAnnouncements, createAnnouncement };
