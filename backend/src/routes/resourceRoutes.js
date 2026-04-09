const express = require("express");
const {
  getResources,
  uploadFile,
  createResource,
  deleteResource,
} = require("../controllers/resourceController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);
router.get("/", getResources);
router.post("/upload", authorize("teacher"), upload.single("file"), uploadFile);
router.post("/", authorize("teacher"), createResource);
router.delete("/:id", authorize("teacher", "admin"), deleteResource);

module.exports = router;
