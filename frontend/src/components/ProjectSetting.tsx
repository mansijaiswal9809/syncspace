import { useEffect, useState } from "react";
import type { FC } from "react";
import ProjectHeader from "./ProjectHeader";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Organization, Project, User } from "../type";
import AddMemberModal from "./AddMemberModal";
import { useSelector } from "react-redux";

const ProjectSetting: FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const selectedOrg: Organization | null = useSelector(
    (state: any) => state.organization?.selectedOrganization
  );

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(res.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (key: string, value: string | number) => {
    setProject((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleAddMembers = async (newMembers: User[]) => {
    if (!project) return;

    const updatedProject = {
      ...project,
      members: [...project.members, ...newMembers],
    };

    try {
      await axios.patch(
        `http://localhost:5000/api/projects/${id}`,
        updatedProject
      );
      setProject(updatedProject);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding members:", error);
      alert("Failed to add members.");
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("progress", parseInt(e.target.value, 10));
  };

  const handleSaveChanges = async () => {
    if (!project) return;
    try {
      setSaving(true);
      await axios.patch(`http://localhost:5000/api/projects/${id}`, project);
      alert("Project updated successfully!");
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ProjectHeader
        team={project.members}
        projectName={project.name}
        status={project.status}
      />

      <div className="flex gap-6 flex-col lg:flex-row items-start my-6">
        <div className="bg-white flex-1 dark:bg-gray-800 shadow rounded-xl p-6 space-y-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Project Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Project Name</label>
              <input
                type="text"
                value={project.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                value={project.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option>Planning</option>
                <option>Active</option>
                <option>On Hold</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Priority</label>
              <select
                value={project.priority || ""}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Start Date</label>
              <input
                type="date"
                value={
                  project?.startDate ? project.startDate.split("T")[0] : ""
                }
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input
                type="date"
                value={project?.endDate ? project.endDate.split("T")[0] : ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={project.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Progress: {project.progress}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={project.progress || 0}
              onChange={handleProgressChange}
              className="w-full accent-blue-600"
            />
          </div>

          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 lg:mt-0 lg:w-[30%] w-full bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Team Members ({project.members.length})
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Add Member
            </button>
          </div>
          <ul className="space-y-2">
            {project.members.map((member) => {
              const isLead = member._id === project.lead;

              return (
                <li
                  key={member._id}
                  className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isLead ? "Lead" : "Member"}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isLead
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300"
                    }`}
                  >
                    {isLead ? "Lead" : "Member"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {showModal && (
        <AddMemberModal
          projectName={project.name}
          existingMembers={project.members}
          allUsers={selectedOrg?.members || []}
          onAddMembers={handleAddMembers}
          onClose={() => setShowModal(false)}
          projectId={project._id}
        />
      )}
    </div>
  );
};

export default ProjectSetting;
