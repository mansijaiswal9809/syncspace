import type { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {

  Activity,
  Clock4,
  Users,
  UserPlus,

} from "lucide-react";
import ProjectHeader from "./ProjectHeader";

interface Task {
  title: string;
  type: "TASK" | "BUG" | "IMPROVEMENT" | "FEATURE" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN PROGRESS" | "DONE";
}

const ProjectAnalytics: FC = () => {
  const tasks: Task[] = [
    { title: "Ui", type: "TASK", priority: "MEDIUM", status: "TODO" },
    {
      title: "Integration",
      type: "TASK",
      priority: "MEDIUM",
      status: "IN PROGRESS",
    },
    {
      title: "Resolve Bug",
      type: "BUG",
      priority: "MEDIUM",
      status: "IN PROGRESS",
    },
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "IN PROGRESS"
  ).length;
  const todoTasks = tasks.filter((t) => t.status === "TODO").length;
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
  tasks.forEach((t) => (typeCounts[t.type] = (typeCounts[t.type] || 0) + 1));
  const typeData = Object.entries(typeCounts).map(([type, value]) => ({
    name: type,
    value,
  }));

  const priorityCounts: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  tasks.forEach((t) => (priorityCounts[t.priority] += 1));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  return (
    <div className="lg:p-8 flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      <ProjectHeader/>
      <div className="space-y-8 mt-10">
        {/* Bottom Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {/* Active Tasks */}
          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Tasks
              </p>
              <p className="text-xl font-semibold mt-1 text-sky-600 dark:text-sky-400">
                {activeTasks}
              </p>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <Clock4 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Overdue Tasks
              </p>
              <p className="text-xl font-semibold mt-1 text-rose-600 dark:text-rose-400">
                {overdueTasks}
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Team Members
              </p>
              <p className="text-xl font-semibold mt-1 text-indigo-600 dark:text-indigo-400">
                {teamMembers}
              </p>
            </div>
          </div>

          {/* Team Size */}
          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Team Size
              </p>
              <p className="text-xl font-semibold mt-1 text-cyan-600 dark:text-cyan-400">
                {teamSize}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Tasks by Status
          </p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              data={statusData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={"#ccc"} />
              <XAxis type="number" tickFormatter={(val) => `${val * 100}%`} />
              <YAxis type="category" dataKey="name" />
              <Tooltip
                formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
              />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Type Pie */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Tasks by Type
          </p>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Tasks by Priority
          </p>
          {["LOW", "MEDIUM", "HIGH"].map((p) => {
            const count = priorityCounts[p];
            const percent = totalTasks ? (count / totalTasks) * 100 : 0;
            return (
              <div key={p} className="mb-3">
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-100 mb-1">
                  <span>{p.toLowerCase()}</span>
                  <span>
                    {count} tasks ({percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
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
