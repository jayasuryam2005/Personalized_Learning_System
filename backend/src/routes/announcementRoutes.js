const express = require("express");
const { getAnnouncements, createAnnouncement } = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getAnnouncements);
router.post("/", authorize("teacher"), createAnnouncement);

module.exports = router;
