import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { FC } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Users,
  LayoutDashboard,
  ListTodo,
  BarChart2,
  ClipboardList,
  Calendar,
  Settings,
  LogIn,
  Code2,
  Moon,
  Sun,
} from "lucide-react";

interface SubItem {
  name: string;
  path: string;
  icon: any;
}
interface Project {
  name: string;
  icon: any;
  subItems: SubItem[];
}
interface MenuItem {
  name: string;
  path: string;
  icon: any;
}
interface Task {
  title: string;
  status: "TODO" | "IN PROGRESS" | "DONE";
}

const CSIASidebar: FC = () => {
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const menuItems: MenuItem[] = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Projects", path: "/projects", icon: <Folder size={20} /> },
    { name: "Team", path: "/team", icon: <Users size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const tasks: Task[] = [
    { title: "UI", status: "TODO" },
    { title: "Integration", status: "IN PROGRESS" },
    { title: "Resolve Bug", status: "IN PROGRESS" },
  ];

  const projectList: Project[] = [
    {
      name: "Login",
      icon: <LogIn size={18} />,
      subItems: [
        {
          name: "Tasks",
          path: "/project-details",
          icon: <ClipboardList size={16} />,
        },
        {
          name: "Analytics",
          path: "/analytics",
          icon: <BarChart2 size={16} />,
        },
        { name: "Calendar", path: "/calendar", icon: <Calendar size={16} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={16} /> },
      ],
    },
    {
      name: "Footer",
      icon: <Code2 size={18} />,
      subItems: [
        {
          name: "Tasks",
          path: "/project-details",
          icon: <ClipboardList size={16} />,
        },
        {
          name: "Analytics",
          path: "/analytics",
          icon: <BarChart2 size={16} />,
        },
        { name: "Calendar", path: "/calendar", icon: <Calendar size={16} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={16} /> },
      ],
    },
  ];

  const toggleProject = (name: string) =>
    setOpenProject((prev) => (prev === name ? null : name));

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? "Close" : "Menu"}
      </button>

      <aside
        className={`
          fixed md:static overflow-y-scroll text-xs top-0 left-0 w-72 bg-white dark:bg-[#1e1e2f] text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          z-40
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
            CSIA
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}

          {/* My Tasks */}
          <div className="mt-4">
            <button
              onClick={() => setIsTaskOpen(!isTaskOpen)}
              className="w-full flex justify-between items-center text-gray-800 dark:text-gray-100 font-semibold px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <span className="flex items-center gap-2">
                <ListTodo size={18} /> My Tasks
              </span>
              {isTaskOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isTaskOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="ml-4 mt-2 space-y-3 text-xs">
                {tasks.map((task, i) => (
                  <NavLink to="/tasks">
                    <li
                      key={i}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                      <span className="font-medium">{task.title}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          task.status === "TODO"
                            ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                            : task.status === "IN PROGRESS"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100"
                            : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                        }`}
                      >
                        {task.status}
                      </span>
                    </li>
                  </NavLink>
                ))}
              </ul>
            </div>
          </div>

          {/* Projects */}
          <div className="mt-4">
            <span className="block px-2 py-1 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">
              Projects
            </span>
            <ul className="ml-2 mt-2 space-y-2 text-xs">
              {projectList.map((project) => (
                <li key={project.name}>
                  <button
                    onClick={() => toggleProject(project.name)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
                  >
                    <span className="flex items-center gap-2">
                      {project.icon}
                      {project.name}
                    </span>
                    {openProject === project.name ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  {openProject === project.name && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {project.subItems.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                              isActive
                                ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100"
                                : "hover:bg-gray-50 dark:hover:bg-gray-900"
                            }`
                          }
                        >
                          {sub.icon} <span>{sub.name}</span>
                        </NavLink>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <footer className="border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          © 2025 SyncSpace
        </footer>
      </aside>
    </>
  );
};

export default CSIASidebar;
