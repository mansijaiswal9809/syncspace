import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  token: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "ACCEPTED", "EXPIRED"], default: "PENDING" },
});

export default mongoose.model("Invite", inviteSchema);
