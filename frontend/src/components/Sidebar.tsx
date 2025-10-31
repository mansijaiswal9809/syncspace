import { useState } from "react";
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

interface SubItem { name: string; icon: any; }
interface Project { name: string; icon: any; subItems: SubItem[]; }
interface MenuItem { name: string; icon: any; }
interface Task { title: string; status: "TODO" | "IN PROGRESS" | "DONE"; }
interface Workspace { name: string; status: boolean; }
type OpenState = { workspace: boolean; };

const CSIASidebar: FC = () => {
  const [open, setOpen] = useState<OpenState>({ workspace: false });
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Projects", icon: <Folder size={20} /> },
    { name: "Team", icon: <Users size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  const workspaces: Workspace[] = [
    { name: "Workspace 1", status: true },
    { name: "Workspace 2", status: false },
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
        { name: "Tasks", icon: <ClipboardList size={16} /> },
        { name: "Analytics", icon: <BarChart2 size={16} /> },
        { name: "Calendar", icon: <Calendar size={16} /> },
        { name: "Settings", icon: <Settings size={16} /> },
      ],
    },
    {
      name: "Footer",
      icon: <Code2 size={18} />,
      subItems: [
        { name: "Tasks", icon: <ClipboardList size={16} /> },
        { name: "Analytics", icon: <BarChart2 size={16} /> },
        { name: "Calendar", icon: <Calendar size={16} /> },
        { name: "Settings", icon: <Settings size={16} /> },
      ],
    },
  ];

  const toggleProject = (name: string) => setOpenProject(prev => (prev === name ? null : name));

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-72 bg-white dark:bg-[#1e1e2f] text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          z-40
        `}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1
              onClick={() => setOpen({ workspace: !open.workspace })}
              className="text-2xl cursor-pointer font-bold text-blue-600 dark:text-blue-400 tracking-tight"
            >
              CSIA
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {workspaces.length} workspaces
          </div>

          {open.workspace && (
            <div className="transition-all duration-300 ease-in-out overflow-hidden">
              {workspaces.map((ws, idx) => (
                <div className="flex justify-between items-center text-sm py-1" key={idx}>
                  <span>{ws.name}</span>
                  {ws.status && (
                    <span className="text-green-500 text-xs font-semibold">Active</span>
                  )}
                </div>
              ))}
              <button className="text-xs mt-2 text-blue-600 dark:text-blue-400 hover:underline">
                + Create Workspace
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-2">
          {menuItems.map(item => (
            <div
              key={item.name}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
          ))}

          {/* My Tasks */}
          <div>
            <button
              onClick={() => setIsTaskOpen(!isTaskOpen)}
              className="w-full flex justify-between items-center text-gray-800 dark:text-gray-100 font-semibold px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <span className="flex items-center gap-2"><ListTodo size={18}/> My Tasks</span>
              {isTaskOpen ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isTaskOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="ml-4 mt-2 space-y-3 text-sm">
                {tasks.map((task, i) => (
                  <li key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    <p className="font-medium">{task.title}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${task.status === "TODO" ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100" : task.status === "IN PROGRESS" ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100" : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"}`}>{task.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Projects */}
          <div className="mt-4">
            <button className="w-full flex justify-between items-center font-semibold px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              <span className="flex items-center gap-2"><Folder size={18}/> Projects</span>
            </button>

            <ul className="ml-2 mt-2 space-y-2 text-sm">
              {projectList.map(project => (
                <li key={project.name}>
                  <button
                    onClick={() => toggleProject(project.name)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <span className="flex items-center gap-2">{project.icon}{project.name}</span>
                    {openProject === project.name ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                  </button>

                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openProject === project.name ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                    <ul className="ml-8 mt-2 space-y-1">
                      {project.subItems.map((sub, i) => (
                        <li key={i} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition">{sub.icon}<span>{sub.name}</span></li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          © 2025 CSIA
        </footer>
      </aside>
    </>
  );
};

export default CSIASidebar;
