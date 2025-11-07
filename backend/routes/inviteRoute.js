// POST /api/invite
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Organization from "../models/Organization.js";
import Invite from "../models/Invite.js";

router.post("/invite", async (req, res) => {
  try {
    const { email, role, orgId } = req.body;
    const organization = await Organization.findById(orgId);
    if (!organization) return res.status(404).json({ message: "Organization not found" });

    // create token (expires in 3 days)
    const token = jwt.sign({ email, orgId, role }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // save invitation in DB
    const invite = new Invite({
      email,
      orgId,
      role,
      token,
      status: "PENDING",
    });
    await invite.save();

    // send email with link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const inviteLink = `${process.env.CLIENT_URL}/invite/${token}`;

    await transporter.sendMail({
      from: `"${organization.name}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `You're invited to join ${organization.name}!`,
      html: `
        <h2>Join ${organization.name}</h2>
        <p>You have been invited as <strong>${role}</strong>.</p>
        <a href="${inviteLink}" style="background:#2563eb;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">Accept Invitation</a>
      `,
    });

    res.json({ message: "Invitation sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send invite" });
  }
});

// GET /api/invite/verify/:token
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const invite = await Invite.findOne({ token: req.params.token, status: "PENDING" });
    if (!invite) return res.status(400).json({ message: "Invalid or expired invitation" });
    res.json(decoded); // email, orgId, role
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
});


// POST /api/invite/accept
router.post("/accept", async (req, res) => {
  try {
    const { token, userId } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, orgId, role } = decoded;

    const invite = await Invite.findOne({ token, status: "PENDING" });
    if (!invite) return res.status(400).json({ message: "Invalid invitation" });

    // Add user to org
    await Organization.findByIdAndUpdate(orgId, {
      $addToSet: { members: { _id: userId, email, role } },
    });

    invite.status = "ACCEPTED";
    await invite.save();

    res.json({ message: "Invitation accepted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to accept invite" });
  }
});
