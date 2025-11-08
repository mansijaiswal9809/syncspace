import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true, unique: true },
  accepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
