import express from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const workspace = req.body.workspace;
    const isAdmin = workspace.admin.some((admin) => admin._id == req.user._id);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can create projects" });
    }
    const project = await Project.create({
      ...req.body,
      workspace: workspace._id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  const projects = await Project.find({ workspace: req.query.workspace });
  // console.log("xyz")
  // .populate("workspace", "name slug")
  // .populate("lead", "name email role");
  res.json(projects);
});

router.get("/:id", protect, async (req, res) => {
  try {
    // console.log("Fetching")
    const project = await Project.findById(req.params.id).populate(
      "members",
      "name email"
    );
    // .populate("workspace", "name slug")
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.patch("/:id", protect, async (req, res) => {
  try {
    console.log(req.body);
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log(updatedProject);
    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating project:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const { selectedOrganization } = req.body;
    console.log(selectedOrganization)
    const isAdmin = selectedOrganization.admin.some(
      (admin) => admin._id == req.user._id
    );
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can delete projects" });
    }
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
