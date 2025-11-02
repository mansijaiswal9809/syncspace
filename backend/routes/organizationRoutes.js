import express from "express";
import Organization from "../models/Organization.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";

let router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/", protect, upload.single("logo"), async (req, res) => {
  try {
    const { name, slug } = req.body;
    let logoUrl = "";

    if (req.file) {
      // Example: serve files from /uploads
      logoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const org = await Organization.create({
      name,
      slug,
      logo: logoUrl,
      createdBy: req.user._id,
      admin: [req.user._id],
      members: [req.user._id],
    });

    res.status(201).json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  const orgs = await Organization.find({ createdBy: req.user._id }).populate(
    "members createdBy",
    "name email role"
  );
  res.json(orgs);
});

router.get("/:id", async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).populate(
      "admin members",
      "name email role"
    );
    if (!org) return res.status(404).json({ error: "Organization not found" });
    res.json(org);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const org = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Organization.findByIdAndDelete(req.params.id);
    res.json({ message: "Organization deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
