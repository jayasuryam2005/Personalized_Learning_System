const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
