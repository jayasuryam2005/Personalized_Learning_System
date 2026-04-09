const Message = require("../models/Message");
const asyncHandler = require("../utils/asyncHandler");

const getMessages = asyncHandler(async (req, res) => {
  const { userId, contactId } = req.query;

  if (!userId) {
    const messages = await Message.find()
      .populate("from", "name email role")
      .populate("to", "name email role")
      .sort({ createdAt: 1 });
    res.json(messages);
    return;
  }

  const filter = contactId
    ? {
        $or: [
          { from: userId, to: contactId },
          { from: contactId, to: userId },
        ],
      }
    : {
        $or: [{ from: userId }, { to: userId }],
      };

  const messages = await Message.find(filter)
    .populate("from", "name email role")
    .populate("to", "name email role")
    .sort({ createdAt: 1 });

  res.json(messages);
});

const createMessage = asyncHandler(async (req, res) => {
  const { to, text } = req.body;

  if (!to || !text) {
    res.status(400);
    throw new Error("Recipient and message text are required.");
  }

  if (String(to) === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot message yourself.");
  }

  const now = new Date();
  const message = await Message.create({
    from: req.user._id,
    to,
    text,
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: now.toLocaleDateString(),
    read: false,
  });

  const populated = await Message.findById(message._id)
    .populate("from", "name email role")
    .populate("to", "name email role");

  res.status(201).json(populated);
});

const markRead = asyncHandler(async (req, res) => {
  const { fromId, toId } = req.body;
  await Message.updateMany({ from: fromId, to: toId, read: false }, { $set: { read: true } });
  res.json({ message: "Messages marked as read." });
});

module.exports = { getMessages, createMessage, markRead };
