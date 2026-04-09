const express = require("express");
const { getRoadmaps, upsertRoadmap } = require("../controllers/roadmapController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getRoadmaps);
router.put("/", authorize("teacher"), upsertRoadmap);

module.exports = router;
