import { useState } from "react";
import type { FC } from "react";
import ProjectHeader from "./ProjectHeader";

interface Task {
  title: string;
  type: "TASK" | "BUG" | "IMPROVEMENT" | "FEATURE" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN PROGRESS" | "DONE";
  assignee: string;
  due: string;
  avatar: string;
}

const ProjectDetailsInteractive: FC = () => {
  const allTypes = ["TASK", "BUG", "IMPROVEMENT", "FEATURE", "OTHER"];
  const allStatuses = ["TODO", "IN PROGRESS", "DONE"];
  const allAssignees = ["Mansi Jaiswal"];

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");

  const [tasks, setTasks] = useState<Task[]>([
    {
      title: "Ui",
      type: "TASK",
      priority: "MEDIUM",
      status: "TODO",
      assignee: "Mansi Jaiswal",
      avatar: "M",
      due: "06 Nov 2025",
    },
    {
      title: "Integration",
      type: "TASK",
      priority: "MEDIUM",
      status: "IN PROGRESS",
      assignee: "Mansi Jaiswal",
      avatar: "M",
      due: "01 Nov 2025",
    },
    {
      title: "Resolve Bug",
      type: "BUG",
      priority: "MEDIUM",
      status: "IN PROGRESS",
      assignee: "Mansi Jaiswal",
      avatar: "M",
      due: "05 Nov 2025",
    },
  ]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "border-blue-400 text-blue-600 focus:ring-blue-500";
      case "IN PROGRESS":
        return "border-yellow-400 text-yellow-600 focus:ring-yellow-500";
      case "DONE":
        return "border-green-400 text-green-600 focus:ring-green-500";
      case "BLOCKED":
        return "border-purple-400 text-purple-600 focus:ring-purple-500";
      default:
        return "border-gray-300 text-gray-900 dark:text-gray-100 focus:ring-blue-500";
    }
  };

  const handleStatusChange = (index: number, newStatus: Task["status"]) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = newStatus;
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (statusFilter === "All Status" || task.status === statusFilter) &&
      (typeFilter === "All Types" || task.type === typeFilter) &&
      (priorityFilter === "All Priorities" ||
        task.priority === priorityFilter) &&
      (assigneeFilter === "All Assignees" || task.assignee === assigneeFilter)
    );
  });

  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 h-screen overflow-y-auto">
      <ProjectHeader />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 my-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option>All Status</option>
          {allStatuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option>All Types</option>
          {allTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option>All Priorities</option>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
        </select>

        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option>All Assignees</option>
          {allAssignees.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Task Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-gray-900 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
            <tr>
              <th className="py-3 px-4 font-medium">Title</th>
              <th className="py-3 px-4 font-medium">Type</th>
              <th className="py-3 px-4 font-medium">Priority</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Assignee</th>
              <th className="py-3 px-4 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="py-3 px-4">{task.title}</td>
                <td className="py-3 px-4">{task.type}</td>
                <td className="py-3 px-4">{task.priority}</td>
                <td className="py-3 px-4">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(i, e.target.value as Task["status"])
                    }
                    className={`px-2 py-1 text-sm rounded-lg bg-white dark:bg-gray-800 transition font-medium focus:outline-none focus:ring-2 ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {allStatuses.map((s) => (
                      <option
                        className="text-[#000000d1] dark:text-white"
                        key={s}
                        value={s}
                      >
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    {task.avatar}
                  </div>
                  {task.assignee}
                </td>
                <td className="py-3 px-4">{task.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetailsInteractive;
