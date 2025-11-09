import bcrypt from "bcrypt";
import express from "express";
import crypto from "crypto";
import Invite from "../models/Invite.js";
import Organization from "../models/Organization.js";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/invite", protect, async (req, res) => {
  const { orgId, email, role, inviterId } = req.body;
  console.log(orgId, email, role, inviterId);

  if (!orgId || !email || !role || !inviterId)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    // Create unique token
    const token = crypto.randomBytes(20).toString("hex");

    const invite = new Invite({
      email,
      role,
      orgId,
      inviter: inviterId,
      token,
    });
    await invite.save();

    // Send email
    const acceptUrl = `http://localhost:5173/accept-invite/${token}`;
    await sendEmail({
      to: email,
      subject: `You're invited to join ${org.name}`,
      text: `You have been invited as ${role}. Click here to join: ${acceptUrl}`,
      html: `<p>You have been invited to join <b>${org.name}</b> as <b>${role}</b>.</p>
             <p><a href="${acceptUrl}">Click here to accept</a></p>`,
    });

    res.json({ success: true, message: "Invite sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/accept-invite/:token", async (req, res) => {
  const { token } = req.params;
  const { name, password } = req.body; // registration info

  try {
    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(404).json({ error: "Invite not found" });
    if (invite.accepted)
      return res.status(400).json({ error: "Invite already accepted" });

    // Check if user already exists
    let user = await User.findOne({ email: invite.email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Register new user
      user = new User({
        name,
        email: invite.email,
        password: hashedPassword,
      });

      await user.save();
    }

    // Add user to organization
    const org = await Organization.findById(invite.orgId);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    if (!org.members.includes(user._id)) org.members.push(user._id);
    if (invite.role === "Admin" && !org.admin.includes(user._id))
      org.admin.push(user._id);

    await org.save();

    // Mark invite as accepted
    invite.accepted = true;
    await invite.save();

    res.json({
      success: true,
      message: "You have joined the organization!",
      user: {
        name: user.name,
        email: user.email,
        role: invite.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
