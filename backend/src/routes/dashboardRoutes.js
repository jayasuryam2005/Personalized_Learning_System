const express = require("express");
const {
  getStudentDashboard,
  getTeacherDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/student", authorize("student"), getStudentDashboard);
router.get("/teacher", authorize("teacher"), getTeacherDashboard);
router.get("/admin", authorize("admin"), getAdminDashboard);

module.exports = router;
