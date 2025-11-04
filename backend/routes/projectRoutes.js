import express from "express";
import Project from "../models/Project.js";
import { authorized, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const projects = await Project.find({ workspace: req.query.workspace });
  // console.log("xyz")
  // .populate("workspace", "name slug")
  // .populate("lead", "name email role");
  res.json(projects);
});

router.get("/:id", async (req, res) => {
  try {
    // console.log("Fetching")
    const project = await Project.findById(req.params.id).populate(
      "members",
      "name email role"
    );
    // .populate("workspace", "name slug")
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    console.log(req.body)
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log(updatedProject)
    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating project:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
