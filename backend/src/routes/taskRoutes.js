const express = require("express");

const {
  createTask,
  getAllTasks,
  getUserTasks,
  getBlockedTasks,
  updateTask,
  deleteTask,
  completeTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/user/:userId", getUserTasks);
router.get("/blocked", getBlockedTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/complete", completeTask);

module.exports = router;