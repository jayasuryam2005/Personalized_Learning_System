const express = require("express");
const { getProgress, upsertProgress } = require("../controllers/progressController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getProgress);
router.post("/", authorize("student", "teacher", "admin"), upsertProgress);

module.exports = router;
