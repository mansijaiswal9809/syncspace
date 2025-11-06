import { type FC, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "Lead" |"admin" | "member";
}

interface AddMemberModalProps {
  projectId: string;
  projectName: string;
  existingMembers: User[];
  allUsers: User[];
  onAddMembers: (newMembers: User[]) => void;
  onClose: () => void;
}

const AddMemberModal: FC<AddMemberModalProps> = ({
  projectId,
  projectName,
  existingMembers,
  allUsers,
  onAddMembers,
  onClose,
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [role, setRole] = useState<"Lead" | "Member">("Member");
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddClick = async () => {
    if (selectedUserIds.length === 0) return;
    setLoading(true);

    try {
      if (role === "Member") {
        const updatedMembers = [
          ...existingMembers.map((m) => m._id),
          ...selectedUserIds,
        ];

        await axios.patch(`http://localhost:5000/api/projects/${projectId}`, {
          members: updatedMembers,
        });

        const newMembers = selectedUserIds
          .map((id) => allUsers.find((u) => u._id === id))
          .filter(Boolean) as User[];

        onAddMembers(newMembers);
      } else if (role === "Lead") {
        const leadId = selectedUserIds[0];
        const updatedMembers = [
          ...existingMembers.map((m) => m._id),
          leadId,
        ];

        await axios.patch(`http://localhost:5000/api/projects/${projectId}`, {
          lead: leadId,
          members: updatedMembers,
        });

        const leadUser = allUsers.find((u) => u._id === leadId);
        if (leadUser) {
          onAddMembers([{ ...leadUser, role: "Lead" }]);
        }
      }

      onClose();
    } catch (error) {
      console.error("Error updating project members:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-lg p-6 relative border border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-1">Add Member to Project</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Adding to Project:{" "}
          <span className="font-medium">{projectName}</span>
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Select from existing users
          </label>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2 dark:border-gray-700">
            {allUsers.length > 0 ? (
              allUsers.map((user) => {
                const isDisabled = existingMembers.some(
                  (m) => m._id === user._id
                );
                return (
                  <label
                    key={user._id}
                    className={`flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isDisabled}
                      checked={selectedUserIds.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                    />
                    <span>{user.name}</span>
                    {isDisabled && (
                      <span className="text-xs ml-auto text-gray-500">
                        (Already Added)
                      </span>
                    )}
                  </label>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 px-2">
                No users found in organization.
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "Lead" | "Member")}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Member">Member</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gray-200 cursor-pointer dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddClick}
            disabled={selectedUserIds.length === 0 || loading}
            className="px-4 py-2 rounded-md bg-blue-600 cursor-pointer text-white hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
