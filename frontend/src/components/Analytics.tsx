import type { FC } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Task {
  title: string;
  type: "TASK" | "BUG" | "IMPROVEMENT" | "FEATURE" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN PROGRESS" | "DONE";
}

const ProjectAnalytics: FC = () => {
  const tasks: Task[] = [
    { title: "Ui", type: "TASK", priority: "MEDIUM", status: "TODO" },
    { title: "Integration", type: "TASK", priority: "MEDIUM", status: "IN PROGRESS" },
    { title: "Resolve Bug", type: "BUG", priority: "MEDIUM", status: "IN PROGRESS" },
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "DONE").length;
  const inProgressTasks = tasks.filter(t => t.status === "IN PROGRESS").length;
  const todoTasks = tasks.filter(t => t.status === "TODO").length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeTasks = inProgressTasks;
  const overdueTasks = 0; 
  const teamMembers = 1;
  const teamSize = 1;

  const statusData = [
    { name: "TODO", value: todoTasks / totalTasks },
    { name: "IN PROGRESS", value: inProgressTasks / totalTasks },
    { name: "DONE", value: completedTasks / totalTasks },
  ];

  const typeCounts: Record<string, number> = {};
  tasks.forEach(t => typeCounts[t.type] = (typeCounts[t.type] || 0) + 1);
  const typeData = Object.entries(typeCounts).map(([type, value]) => ({ name: type, value }));

  const priorityCounts: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  tasks.forEach(t => priorityCounts[t.priority] += 1);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  return (
    <div className="p-8 flex-1 bg-gray-50 dark:bg-gray-900 h-screen overflow-y-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Login Project Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Status: PLANNING</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{completedTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{inProgressTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Tasks</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{activeTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Tasks</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{overdueTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Team Members</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{teamMembers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{teamSize}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tasks by Status</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={"#ccc"} />
              <XAxis type="number" tickFormatter={(val) => `${val * 100}%`} />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(val: number) => `${(val * 100).toFixed(0)}%`} />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Type Pie */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tasks by Type</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                fill="#8884d8"
                label
              >
                {typeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tasks by Priority</p>
          {["LOW", "MEDIUM", "HIGH"].map(p => {
            const count = priorityCounts[p];
            const percent = totalTasks ? (count / totalTasks) * 100 : 0;
            return (
              <div key={p} className="mb-3">
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-100 mb-1">
                  <span>{p.toLowerCase()}</span>
                  <span>{count} tasks ({percent.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
                  <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
