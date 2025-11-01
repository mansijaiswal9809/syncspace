import { useState } from "react";
import type { FC } from "react";
import ProjectHeader from "./ProjectHeader";

const ProjectSetting: FC = () => {
  const [project, setProject] = useState({
    name: "Login",
    description: "login page",
    status: "Planning",
    priority: "High",
    startDate: "2025-10-24",
    endDate: "2025-11-07",
    progress: 0,
  });

  const [team, setTeam] = useState([
    { email: "the.mansi.jaiswal@gmail.com", role: "Team Lead" },
  ]);

  const handleChange = (key: string, value: string | number) => {
    setProject((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddMember = () => {
    const email = prompt("Enter member email:");
    if (email) {
      setTeam((prev) => [...prev, { email, role: "Member" }]);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("progress", parseInt(e.target.value, 10));
  };

  return (
    <div className="p-6 min-h-screen flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
     <ProjectHeader/>
      <div className="flex gap-6 flex-col lg:flex-row items-start my-6">
        {/* Project Details */}
        <div className="bg-white flex-1 dark:bg-gray-800 shadow rounded-xl p-6 space-y-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Project Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                value={project.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={project.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={project.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input
                type="date"
                value={project.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={project.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Progress: {project.progress}%
            </label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={project.progress}
                onChange={handleProgressChange}
                className="w-full h-2 rounded-lg accent-blue-600 dark:bg-gray-700"
              />
              <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-3 bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>

        {/* Team Members */}
        <div className="mt-6 lg:mt-0 lg:w-[30%] w-full bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Team Members ({team.length})
            </h3>
            <button
              onClick={handleAddMember}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
            >
              Add Member
            </button>
          </div>
          <ul className="space-y-2">
            {team.map((member, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div>
                  <p className="font-medium">{member.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetting;
