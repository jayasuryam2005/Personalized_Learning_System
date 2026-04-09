const express = require("express");
const { getMessages, createMessage, markRead } = require("../controllers/messageController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getMessages);
router.post("/", authorize("student", "teacher"), createMessage);
router.patch("/read", authorize("student", "teacher"), markRead);

module.exports = router;
