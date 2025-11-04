import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({ assignee: req.user._id })
    .populate("project", "name")
    .populate("assignee", "name email role")
    .populate("comments.user", "name email role");
  res.json(tasks);
});
router.get("/:id", protect, async (req, res) => {
  const tasks = await Task.findOne({ _id: req.params.id })
    .populate("project", "name status priority startDate progress")
    .populate("assignee", "name email role")
    .populate("comments.user", "name email role");
  res.json(tasks);
});

router.get("/project/:projectId", async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate("assignee", "name email role")
    .populate("comments.user", "name email role");
  res.json(tasks);
});

router.patch("/:id/comments", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const userId = req.user._id; 

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.comments.push({
      user: userId,
      message: comments,
      createdAt: new Date(), 
    });
    await task.save();
    const updatedTask = await Task.findById(id).populate(
      "comments.user",
      "name"
    );

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
