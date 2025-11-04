import { useEffect, useState } from "react";
import type { FC } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Project, Task, User } from "../type";
import axios from "axios";
import ProjectHeader from "./ProjectHeader";
import { Trash2 } from "lucide-react";

const ProjectDetailsInteractive: FC = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  // Get org members from Redux store
  const orgMembers: User[] = useSelector(
    (state: any) => state.organization?.selectedOrganization?.members || []
  );

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const taskRes = await axios.get<Task[]>(
        `http://localhost:5000/api/tasks/project/${id}`,
        { withCredentials: true }
      );
      setTasks(taskRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  // Fetch project + tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taskRes, projectRes] = await Promise.all([
          axios.get<Task[]>(`http://localhost:5000/api/tasks/project/${id}`),
          axios.get<Project>(`http://localhost:5000/api/projects/${id}`),
        ]);
        setTasks(taskRes.data || []);
        setProject(projectRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // --- Update handlers ---
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
    } catch (error) {
      console.error(`Error updating task ${key}:`, error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        withCredentials: true,
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- Filters ---
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  const allTypes = Array.from(new Set(tasks.map((t) => t.type))).filter(
    Boolean
  );
  const allPriorities = Array.from(
    new Set(tasks.map((t) => t.priority))
  ).filter(Boolean);
  const allAssignees = orgMembers; // Use actual org members from store

  const filteredTasks = tasks.filter((task) => {
    return (
      (statusFilter === "All" || task.status === statusFilter) &&
      (typeFilter === "All" || task.type === typeFilter) &&
      (priorityFilter === "All" || task.priority === priorityFilter) &&
      (assigneeFilter === "All" || task.assignee?.name === assigneeFilter)
    );
  });

  const completedCount = tasks.filter((t) => t.status === "Done").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "border-blue-400 text-blue-600 focus:ring-blue-500";
      case "In Progress":
        return "border-yellow-400 text-yellow-600 focus:ring-yellow-500";
      case "Done":
        return "border-green-400 text-green-600 focus:ring-green-500";
      default:
        return "border-gray-300 text-gray-900 dark:text-gray-100 focus:ring-blue-500";
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
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 h-screen overflow-y-auto">
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
        <div className="flex flex-wrap gap-2 my-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All</option>
            {allTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All</option>
            {allPriorities.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All</option>
            {allAssignees.map((a) => (
              <option key={a._id}>{a.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Task Table */}
      {filteredTasks.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-300 text-center py-10">
          No tasks found for this project.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-x-auto">
          <table className="w-full text-left text-gray-900 dark:text-gray-100">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
              <tr>
                <th className="py-3 px-4 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Assignee</th>
                <th className="py-3 px-4 font-medium">Due Date</th>
                <th className="py-3 px-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, i) => (
                <tr
                  key={task._id || i}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="py-3 px-4">{task.title}</td>
                  <td className="py-3 px-4">{task.type}</td>

                  {/* Priority */}
                  <td className="py-3 px-4">
                    <select
                      value={task.priority}
                      onChange={(e) =>
                        handleTaskUpdate(i, "priority", e.target.value)
                      }
                      className="px-2 py-1 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleTaskUpdate(i, "status", e.target.value)
                      }
                      className={`px-2 py-1 text-sm rounded-lg bg-white dark:bg-gray-800 font-medium focus:outline-none focus:ring-2 ${getStatusColor(
                        task.status
                      )}`}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-4">
                    <select
                      value={task.assignee?._id || ""}
                      onChange={(e) => {
                        const user = orgMembers.find(
                          (u) => u._id === e.target.value
                        );
                        if (user) handleTaskUpdate(i, "assignee", user);
                      }}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none"
                    >
                      <option value="">—</option>
                      {orgMembers.map((a) => (
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
                    <button
                      onClick={() => handleDeleteTask(task._id!)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete Task"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
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
