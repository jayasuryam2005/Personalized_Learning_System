const express = require("express");
const { getPaths, createPath } = require("../controllers/pathController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getPaths);
router.post("/", authorize("teacher"), createPath);

module.exports = router;
