import { useState, useEffect } from "react";
import type { FC } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { X, Users } from "lucide-react";
import type { Organization } from "../type";
import toast from "react-hot-toast";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: any) => void;
}

const CreateProjectModal: FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const selectedOrg: Organization | null = useSelector(
    (state: any) => state.organization?.selectedOrganization
  );

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setStatus("Planning");
    setPriority("Medium");
    setStartDate("");
    setEndDate("");
    setProjectLead("");
    setTeamMembers([]);
    setSubmitted(false);
  };

  useEffect(() => {
    if (projectLead && !teamMembers.includes(projectLead)) {
      setTeamMembers((prev) => [...prev, projectLead]);
    }
  }, [projectLead]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setSubmitted(true); // mark that user tried to submit

    // Validate required fields
    if (
      !selectedOrg?._id ||
      !projectName.trim() ||
      !projectLead ||
      !startDate ||
      !endDate
    ) {
      return; // do not proceed if any required field missing
    }

    const newProject = {
      workspace: selectedOrg,
      name: projectName.trim(),
      description: description.trim(),
      status,
      priority,
      startDate,
      endDate,
      lead: projectLead,
      members: teamMembers,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        newProject,
        { withCredentials: true }
      );

      onCreate(res.data);
      toast.success("Project created successfully!");
      onClose();
      resetForm();
    } catch (err: any) {
      if (err.response) {
        // Backend sent an error response
        if (err.response.status === 403) {
          toast.error(
            err.response.data.message || "You’re not allowed to do this"
          );
        } else {
          toast.error(err.response.data.message || "Something went wrong");
        }
      } else if (err.request) {
        // No response received
        toast.error("No response from server");
      } else {
        // Error setting up the request
        toast.error("Error: " + err.message);
      }
    }
  };

  const handleMemberToggle = (memberId: string) => {
    if (memberId === projectLead) return;

    setTeamMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const orgMembers = selectedOrg?.members || [];

  // Determine if button should be disabled
  const isButtonDisabled =
    !projectName.trim() || !projectLead || !startDate || !endDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl p-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            In workspace
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedOrg?.name || "No organization selected"}
          </p>
        </div>

        {/* Project Name */}
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className={`w-full mb-3 px-3 py-2 border rounded-lg ${
            submitted && !projectName.trim()
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
        />

        {/* Description */}
        <textarea
          placeholder="Describe your project"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Status & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>Planning</option>
            <option>Active</option>
            <option>Completed</option>
            <option>On hold</option>
            <option>Cancelled</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                submitted && !startDate
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                submitted && !endDate
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
          </div>
        </div>

        {/* Project Lead */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Lead <span className="text-red-500">*</span>
          </label>
          <select
            value={projectLead}
            onChange={(e) => setProjectLead(e.target.value)}
            className={`w-full mt-1 px-3 py-2 border rounded-lg ${
              submitted && !projectLead
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
          >
            <option value="">Select a lead</option>
            {orgMembers.map((member: any) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* Team Members */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            Assign Team Members
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700">
            {orgMembers.length ? (
              orgMembers.map((member: any) => (
                <label
                  key={member._id}
                  className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded px-2"
                >
                  <input
                    type="checkbox"
                    value={member._id}
                    checked={teamMembers.includes(member._id)}
                    onChange={() => handleMemberToggle(member._id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200">
                    {member.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No members available
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isButtonDisabled}
            className={`px-4 py-2 cursor-pointer rounded-lg text-white transition ${
              isButtonDisabled
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
