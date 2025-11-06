import { useState, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
import { Clock4, ListTodo, type LucideIcon } from "lucide-react";
import ProjectHeader from "./ProjectHeader";
import type { Project, Task } from "../type";

const ProjectAnalytics: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async (): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);
      const taskRes = await axios.get<Task[]>(
        `http://localhost:5000/api/tasks/project/${id}`,
        { withCredentials: true }
      );
      setTasks(taskRes.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProjectData = async (): Promise<void> => {
      try {
        setLoading(true);
        const projectRes = await axios.get<Project>(
          `http://localhost:5000/api/projects/${id}`,
          { withCredentials: true }
        );
        setProject(projectRes.data);

        const taskRes = await axios.get<Task[]>(
          `http://localhost:5000/api/tasks/project/${id}`,
          { withCredentials: true }
        );
        setTasks(taskRes.data);
      } catch (err) {
        console.error("Error fetching project analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (loading || !project) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400">
        Loading project analytics...
      </div>
    );
  }

  // --- Metrics ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;
  const todoTasks = tasks.filter((t) => t.status === "To Do").length;
  const overdueTasks = tasks.filter(
    (t) =>
      (t.status === "To Do" || t.status === "In Progress") &&
      t.dueDate &&
      new Date(t.dueDate) < new Date()
  ).length;

  // --- Chart Data ---
  const statusData = [
    { name: "To Do", value: totalTasks ? todoTasks / totalTasks : 0 },
    {
      name: "In Progress",
      value: totalTasks ? inProgressTasks / totalTasks : 0,
    },
    { name: "Done", value: totalTasks ? completedTasks / totalTasks : 0 },
  ];

  const typeCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
  });

  const typeData = Object.entries(typeCounts).map(([type, value]) => ({
    name: type,
    value,
  }));

  const priorityCounts: Record<"Low" | "Medium" | "High", number> = {
    Low: 0,
    Medium: 0,
    High: 0,
  };
  tasks.forEach((t) => {
    if (priorityCounts[t.priority as "Low" | "Medium" | "High"] !== undefined) {
      priorityCounts[t.priority as "Low" | "Medium" | "High"] += 1;
    }
  });

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  return (
    <div className="lg:p-8 flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      <ProjectHeader
        projectName={project.name}
        status={project.status}
        totalTask={tasks.length}
        completedTask={completedTasks}
        inProgress={inProgressTasks}
        team={project.members}
        onTaskCreated={fetchData}
      />

      {/* Stats Cards */}
      <div className="space-y-8 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          icon={ListTodo}
          label="To Do Tasks"
          value={todoTasks}
          color="blue"
        />
        <StatCard
          icon={Clock4}
          label="Overdue Tasks"
          value={overdueTasks}
          color="rose"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Tasks by Status">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              data={statusData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis
                type="number"
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
              />
              <YAxis type="category" dataKey="name" />
              <Tooltip
                formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
              />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tasks by Type">
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
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tasks by Priority">
          {(["Low", "Medium", "High"] as const).map((p) => {
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
        </ChartCard>
      </div>
    </div>
  );
};

// --- Reusable Components ---
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: "blue" | "sky" | "rose";
}

const StatCard: FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800",
    sky: "bg-sky-100 text-sky-600 border-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-800",
    rose: "bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800",
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition h-full">
      <div
        className={`p-3 rounded-xl border ${colorClasses[color]} flex items-center justify-center`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold mt-1 text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
};

const ChartCard: FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>
    {children}
  </div>
);

export default ProjectAnalytics;
