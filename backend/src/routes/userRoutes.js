const express = require("express");
const { getUsers, createUser, deleteUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getUsers);
router.post("/", authorize("admin"), createUser);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;
