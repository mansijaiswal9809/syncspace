import { useEffect, useState, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";
import ProjectHeader from "./ProjectHeader";
import type { Project, Task } from "../type";
import { fetchTasks } from "../store/myTaskSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import toast from "react-hot-toast";

const ProjectDetailsInteractive: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedOrganization } = useSelector(
    (state: RootState) => state.organization
  );
  const { user } = useSelector((state: RootState) => state.user);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("All");
  const [isTeamMember, setIsTeamMember] = useState(false);
  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [taskRes, projectRes] = await Promise.all([
        axios.get<Task[]>(`http://localhost:5000/api/tasks/project/${id}`, {
          withCredentials: true,
        }),
        axios.get<Project>(`http://localhost:5000/api/projects/${id}`, {
          withCredentials: true,
        }),
      ]);
      const memberCheck = projectRes.data.members?.some(
        (member) => member._id === user?._id
      );
      setIsTeamMember(!!memberCheck);

      setTasks(taskRes.data || []);
      setProject(projectRes.data || null);
    } catch (err) {
      toast.error("Error fetching project data");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTaskUpdate = async (
    index: number,
    key: keyof Task,
    value: any
  ) => {
    try {
      const updatedTasks = [...tasks];
      updatedTasks[index] = { ...updatedTasks[index], [key]: value };
      setTasks(updatedTasks);

      await axios.patch(
        `http://localhost:5000/api/tasks/${updatedTasks[index]._id}`,
        { [key]: value },
        { withCredentials: true }
      );
      if (selectedOrganization) {
        dispatch(fetchTasks(selectedOrganization._id));
      }
    } catch (err) {
      toast.error(`Error updating task ${key}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        withCredentials: true,
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Error deleting task");
    }
  };

  const projectMembers = project?.members || [];
  const allTypes = Array.from(new Set(tasks.map((t) => t.type))).filter(
    Boolean
  ) as string[];
  const allPriorities = Array.from(
    new Set(tasks.map((t) => t.priority))
  ).filter(Boolean) as string[];

  const filteredTasks = tasks.filter((task) => {
    return (
      (statusFilter === "All" || task.status === statusFilter) &&
      (typeFilter === "All" || task.type === typeFilter) &&
      (priorityFilter === "All" || task.priority === priorityFilter) &&
      (assigneeFilter === "All" || task.assignee?._id === assigneeFilter)
    );
  });

  const completedCount = tasks.filter((t) => t.status === "Done").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Done":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isLead = user && project?.lead === user._id;

  if (loading || !project) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ProjectHeader
        team={project.members}
        projectName={project.name}
        status={project.status}
        totalTask={tasks.length}
        completedTask={completedCount}
        inProgress={inProgressCount}
        onTaskCreated={fetchData}
      />

      {/* Filters */}
      {tasks.length > 0 && (
        <div className="flex flex-wrap gap-3 my-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All</option>
            {allTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All</option>
            {allPriorities.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="All">All</option>
            {projectMembers.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-300 text-center py-10">
          No tasks found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Priority</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Assignee</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.map((task, i) => (
                <tr
                  key={task._id || i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition dark:text-white"
                >
                  <td
                    className="py-3 px-4 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    {task.title}
                  </td>
                  <td className="py-3 px-4">{task.type}</td>

                  <td className="py-3 px-4">
                    <select
                      value={task.priority}
                      onChange={(e) =>
                        isLead &&
                        handleTaskUpdate(i, "priority", e.target.value)
                      }
                      disabled={!isLead}
                      className={`px-2 py-1 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none ${
                        !isLead ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      disabled={!isTeamMember}
                      value={task.status}
                      onChange={(e) =>
                        handleTaskUpdate(i, "status", e.target.value)
                      }
                      className={`px-2 py-1 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 ${getStatusColor(
                        task.status
                      )} 
                      ${!isTeamMember ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={task.assignee?._id || ""}
                      onChange={(e) => {
                        if (!isLead) return;
                        const user = projectMembers.find(
                          (u) => u._id === e.target.value
                        );
                        if (user) handleTaskUpdate(i, "assignee", user);
                      }}
                      disabled={!isLead}
                      className={`px-2 py-1 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none ${
                        !isLead ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">—</option>
                      {projectMembers.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    {task.dueDate?.slice(0, 10) || "—"}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {isTeamMember && (
                      <button
                        onClick={() => task._id && handleDeleteTask(task._id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete Task"
                      >
                        <Trash2 className="inline w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsInteractive;
