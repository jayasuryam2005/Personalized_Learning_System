const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["pdf", "doc", "video", "link"], required: true },
    url: { type: String, trim: true },
    fileName: { type: String, trim: true },
    filePath: { type: String, trim: true },
    size: { type: String, trim: true },
    path: { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath", required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
