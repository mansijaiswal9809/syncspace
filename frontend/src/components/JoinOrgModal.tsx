import { FC, useState } from "react";
import axios from "axios";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  onSuccess?: () => void;
}

const InviteMemberModal: FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  orgId,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/organizations/invite",
        { orgId, email, role },
        { withCredentials: true }
      );

      setSuccess(res.data.message || "Invitation sent successfully!");
      setEmail("");
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Invite Member
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Member Email
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Role Dropdown */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "MEMBER" | "ADMIN")
            }
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Messages */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
