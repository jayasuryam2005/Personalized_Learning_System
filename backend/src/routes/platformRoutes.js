const express = require("express");
const { getPlatforms, updatePlatform } = require("../controllers/platformController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getPlatforms);
router.patch("/:studentId", authorize("admin", "student"), updatePlatform);

module.exports = router;
