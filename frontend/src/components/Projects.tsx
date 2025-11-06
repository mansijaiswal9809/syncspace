import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { FC } from "react";
import type { Project } from "../type";
import { PlusCircle, Search, Users, Calendar, Trash2 } from "lucide-react";
import CreateProjectModal from "./CreateProjectModal";
import { fetchOrgProjects } from "../store/organization";
import type { AppDispatch, RootState } from "../store/store";
import { Link } from "react-router-dom";
import axios from "axios";

const Projects: FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Project["status"]>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | Project["priority"]>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { selectedOrganization, orgProjects, loading } = useSelector(
    (state: RootState) => state.organization
  );

  const filteredProjects = orgProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || p.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300";
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300";
      case "Completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300";
      case "On hold":
        return "bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 dark:text-red-400";
      case "Medium":
        return "text-amber-500 dark:text-amber-400";
      case "Low":
        return "text-gray-500 dark:text-gray-400";
      default:
        return "";
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setDeletingId(projectId);
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);

      if (selectedOrganization?._id) {
        dispatch(fetchOrgProjects(selectedOrganization._id));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage and track your projects</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center mb-6">
        <button
          onClick={() => setModalOpen(true)}
          className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <option value="ALL">All Status</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On hold">On hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <option value="ALL">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project._id || project.name}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition relative"
            >
              <Link
                to={`/settings/${project._id}`}
                className="block"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 mr-6 rounded ${getStatusColor(
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
                  <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority} priority
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {project.members?.length || 0}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-1">Progress</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{project.progress || 0}%</p>

                <div className="flex justify-end items-center text-xs text-gray-400 mt-3">
                  <Calendar size={14} className="mr-1" /> {project.startDate?.slice(0, 10) || "N/A"}
                </div>
              </Link>

              <button
                onClick={() => handleDeleteProject(project._id)}
                disabled={deletingId === project._id}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                title="Delete Project"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={() => {
          if (selectedOrganization?._id) {
            dispatch(fetchOrgProjects(selectedOrganization._id));
          }
        }}
      />
    </div>
  );
};

export default Projects;
