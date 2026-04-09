const fs = require("fs");
const path = require("path");
const Resource = require("../models/Resource");
const LearningPath = require("../models/LearningPath");
const asyncHandler = require("../utils/asyncHandler");

const getResources = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.pathId) {
    filter.path = req.query.pathId;
  }
  if (req.query.uploadedBy) {
    filter.uploadedBy = req.query.uploadedBy;
  }

  const resources = await Resource.find(filter)
    .populate("path", "title modules")
    .populate("uploadedBy", "name email role");

  res.json(resources);
});

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("A file is required.");
  }

  res.status(201).json({
    fileName: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
    filePath: `uploads/${req.file.filename}`,
    url: `/uploads/${req.file.filename}`,
  });
});

const createResource = asyncHandler(async (req, res) => {
  const { title, type, url, fileName, filePath, size, pathId, moduleId, date } = req.body;

  if (!title || !type || !pathId || !moduleId) {
    res.status(400);
    throw new Error("Title, type, pathId, and moduleId are required.");
  }

  const learningPath = await LearningPath.findById(pathId);
  if (!learningPath) {
    res.status(404);
    throw new Error("Learning path not found.");
  }

  const moduleExists = learningPath.modules.some((moduleItem) => String(moduleItem._id) === String(moduleId));
  if (!moduleExists) {
    res.status(400);
    throw new Error("Selected module does not belong to the learning path.");
  }

  const resource = await Resource.create({
    title,
    type,
    url,
    fileName,
    filePath,
    size,
    path: pathId,
    moduleId,
    uploadedBy: req.user._id,
    date: date || new Date().toISOString().split("T")[0],
  });

  const populated = await Resource.findById(resource._id)
    .populate("path", "title modules")
    .populate("uploadedBy", "name email role");

  res.status(201).json(populated);
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error("Resource not found.");
  }

  if (resource.filePath) {
    const absolutePath = path.join(process.cwd(), "backend", resource.filePath.replace(/^\//, ""));
    if (absolutePath.startsWith(path.join(process.cwd(), "backend")) && fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }

  await resource.deleteOne();
  res.json({ message: "Resource deleted successfully." });
});

module.exports = { getResources, uploadFile, createResource, deleteResource };
