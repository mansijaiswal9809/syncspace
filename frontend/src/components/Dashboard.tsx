import type { FC } from "react";
import {
  PlusCircle,
  CheckCircle,
  ListTodo,
  AlertTriangle,
  Users,
  Calendar,

  Clock,
} from "lucide-react";

interface Project {
  name: string;
  description: string;
  status: "PLANNING" | "ACTIVE";
  members: number;
  date: string;
  progress: number;
}

interface Task {
  title: string;
  type: "TASK" | "BUG";
  priority: "MEDIUM" | "HIGH";
  status: "TODO" | "IN PROGRESS" | "DONE";
  assignee: string;
  time: string;
}

const Dashboard: FC = () => {
  const projects: Project[] = [
    {
      name: "Login",
      description: "login page",
      status: "PLANNING",
      members: 1,
      date: "Nov 7, 2025",
      progress: 0,
    },
    {
      name: "Footer",
      description: "design footer",
      status: "ACTIVE",
      members: 1,
      date: "Oct 23, 2025",
      progress: 0,
    },
  ];

  const recentActivities: Task[] = [
    {
      title: "Ui",
      type: "TASK",
      priority: "MEDIUM",
      status: "TODO",
      assignee: "Mansi Jaiswal",
      time: "Oct 30, 10:10 PM",
    },
    {
      title: "integration",
      type: "TASK",
      priority: "MEDIUM",
      status: "IN PROGRESS",
      assignee: "Mansi Jaiswal",
      time: "Oct 31, 10:14 AM",
    },
    {
      title: "resolve bug",
      type: "BUG",
      priority: "MEDIUM",
      status: "IN PROGRESS",
      assignee: "Mansi Jaiswal",
      time: "Oct 31, 10:16 AM",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Welcome back, Mansi Jaiswal 👋</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here's what's happening with your projects today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">New Project</span>
            <PlusCircle className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-semibold mt-2">2</p>
          <p className="text-xs text-gray-400 mt-1">projects in CSIA</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Completed Projects</span>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-semibold mt-2">0</p>
          <p className="text-xs text-gray-400 mt-1">of 2 total</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">My Tasks</span>
            <ListTodo className="text-amber-500" size={20} />
          </div>
          <p className="text-3xl font-semibold mt-2">3</p>
          <p className="text-xs text-gray-400 mt-1">assigned to me</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Overdue</span>
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <p className="text-3xl font-semibold mt-2">0</p>
          <p className="text-xs text-gray-400 mt-1">need attention</p>
        </div>
      </div>

      {/* Project Overview */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Project Overview</h2>
        <button className="text-blue-600 text-sm hover:underline">View all</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  project.status === "ACTIVE"
                    ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300"
                }`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {project.description}
            </p>
            <div className="flex justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={14} /> {project.members} members
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {project.date}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Progress</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{project.progress}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm mb-8">
        {recentActivities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 py-2 last:border-none"
          >
            <div>
              <p className="font-medium">{activity.title}</p>
              <p className="text-xs text-gray-500">
                {activity.status} • {activity.type.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                {activity.assignee.charAt(0)}
              </span>
              <p className="text-xs text-gray-400">{activity.assignee}</p>
              <Clock size={14} className="text-gray-400" />
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
