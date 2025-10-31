import { useState } from "react";
import type { FC } from "react";
import {
  PlusCircle,
  Search,
  Filter,
  SlidersHorizontal,
  Users,
  Calendar,
} from "lucide-react";

interface Project {
  name: string;
  description: string;
  status: "PLANNING" | "ACTIVE" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  progress: number;
  members: number;
  date: string;
}

const Projects: FC = () => {
  const [search, setSearch] = useState("");

  const projects: Project[] = [
    {
      name: "Login",
      description: "login page",
      status: "PLANNING",
      priority: "HIGH",
      progress: 0,
      members: 1,
      date: "Nov 7, 2025",
    },
    {
      name: "Footer",
      description: "design footer",
      status: "ACTIVE",
      priority: "HIGH",
      progress: 0,
      members: 1,
      date: "Oct 23, 2025",
    },
  ];

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300";
      case "ACTIVE":
        return "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 dark:text-red-400";
      case "MEDIUM":
        return "text-amber-500 dark:text-amber-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and track your projects
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center mb-6">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusCircle size={18} /> New Project
        </button>

        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm"
            />
          </div>

          <button className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Filter size={16} /> All Status
          </button>

          <button className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <SlidersHorizontal size={16} /> All Priority
          </button>
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.name}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {project.description}
            </p>

            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span
                className={`font-medium ${getPriorityColor(project.priority)}`}
              >
                {project.priority} priority
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {project.members}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-1">Progress</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{project.progress}%</p>

            <div className="flex justify-end items-center text-xs text-gray-400 mt-3">
              <Calendar size={14} className="mr-1" />
              {project.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
