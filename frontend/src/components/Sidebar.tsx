import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { FC } from "react";
import axios from "axios";
import CreateOrganizationModal from "./CreateOrganizationModal";
import type { Organization, User, Task as TaskType } from "../type";
import { useDispatch, useSelector } from "react-redux";
import type { Project } from "../type";
import {
  setSelectedOrganization,
  fetchOrgProjects,
} from "../store/organization";
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
  Moon,
  Sun,
} from "lucide-react";
import type { AppDispatch } from "../store/store";
import { fetchTasks } from "../store/myTaskSlice";
import toast from "react-hot-toast";

// Sub-items for projects
interface SubItem {
  name: string;
  path: string;
  icon: any;
}

interface MenuItem {
  name: string;
  path: string;
  icon: any;
}

const subItems: SubItem[] = [
  {
    name: "Tasks",
    path: "/project-details",
    icon: <ClipboardList size={16} />,
  },
  { name: "Analytics", path: "/analytics", icon: <BarChart2 size={16} /> },
  { name: "Calendar", path: "/calendar", icon: <Calendar size={16} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={16} /> },
];

const CSIASidebar: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // --- Persisted states with localStorage ---
  const [openProject, setOpenProject] = useState<string | null>(
    localStorage.getItem("openProject")
  );
  const [isTaskOpen, setIsTaskOpen] = useState(
    localStorage.getItem("isTaskOpen") === "true"
  );
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);
  const [orgOpen, setOrgOpen] = useState(false);

  // Redux states
  const { tasks, loading, error } = useSelector((state: any) => state.myTask);
  const { selectedOrganization, orgProjects } = useSelector(
    (state: any) => state.organization
  );
  const currentUser: User | null = useSelector((state: any) => state.user.user);

  // --- Persist changes to localStorage ---
  useEffect(() => {
    localStorage.setItem("openProject", openProject || "");
  }, [openProject]);

  useEffect(() => {
    localStorage.setItem("isTaskOpen", isTaskOpen.toString());
  }, [isTaskOpen]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Handle organization change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrg = allOrganizations.find(
      (org) => org._id === e.target.value
    );
    if (selectedOrg) {
      dispatch(setSelectedOrganization(selectedOrg));
      localStorage.setItem("selectedOrganizationId", selectedOrg._id);
    }
    setOrgOpen(false);
    navigate("/");
  };
  const closeModal = async () => {
    setIsModalOpen(false);

    if (!currentUser?._id) return;

    try {
      // Fetch all organizations of the current user
      const res = await axios.get("http://localhost:5000/api/organizations", {
        withCredentials: true,
      });
      const orgs: Organization[] = res.data;
      setAllOrganizations(orgs);

      // Determine selected organization: localStorage or first org from API
      const savedOrgId = localStorage.getItem("selectedOrganizationId");
      const newSelectedOrg =
        orgs.find((org) => org._id === savedOrgId) || orgs[0];

      if (newSelectedOrg) {
        dispatch(setSelectedOrganization(newSelectedOrg));
        localStorage.setItem("selectedOrganizationId", newSelectedOrg._id);
        // Fetch projects for the new selected organization
        dispatch(fetchOrgProjects(newSelectedOrg._id));
        // Fetch tasks for the new org
        dispatch(fetchTasks(newSelectedOrg._id));
      }
    } catch (err) {
      toast.error("Error fetching organizations after modal close");
    }
  };
  // Fetch all organizations
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/organizations", {
          withCredentials: true,
        });
        setAllOrganizations(res.data);

        // Restore selected org from localStorage
        const savedOrgId = localStorage.getItem("selectedOrganizationId");
        const initialOrg =
          res.data.find((org: Organization) => org._id === savedOrgId) ||
          res.data[0];
        if (initialOrg) {
          dispatch(setSelectedOrganization(initialOrg));
        }
      } catch (error) {
        toast.error("Error fetching organizations");
      }
    };
    fetchOrganization();
  }, [dispatch]);

  // Fetch projects of selected organization
  useEffect(() => {
    if (selectedOrganization?._id) {
      dispatch(fetchOrgProjects(selectedOrganization._id));
    }
  }, [selectedOrganization, dispatch]);

  // Fetch tasks from myTaskSlice
  useEffect(() => {
    if (selectedOrganization) dispatch(fetchTasks(selectedOrganization._id));
  }, [dispatch, selectedOrganization, currentUser]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const menuItems: MenuItem[] = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Projects", path: "/projects", icon: <Folder size={20} /> },
    { name: "Team", path: "/team", icon: <Users size={20} /> },
  ];

  const toggleProject = (name: string) =>
    setOpenProject((prev) => (prev === name ? null : name));

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed cursor-pointer top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static overflow-y-auto text-xs top-0 left-0 w-72 bg-white dark:bg-[#1e1e2f] text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40`}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
              {selectedOrganization?.name || ""}
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Organization Selector */}
          <div className="relative w-full">
            <button
              onClick={() => setOrgOpen(!orgOpen)}
              className="w-full flex cursor-pointer justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <span>{selectedOrganization?.name || "Select Organization"}</span>
              {orgOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {orgOpen && (
              <select
                onChange={handleChange}
                className="absolute z-20 w-full mt-1 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 cursor-pointer"
                size={Math.min(5, allOrganizations.length)}
              >
                {allOrganizations.map((org) => (
                  <option
                    key={org._id}
                    value={org._id}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {org.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg mt-2"
          >
            + Create Organization
          </button>
        </div>

        {/* Menu Section */}
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
              onClick={() => setIsTaskOpen((prev) => !prev)}
              className="w-full cursor-pointer flex justify-between items-center text-gray-800 dark:text-gray-100 font-semibold px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
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
                {loading ? (
                  "Loading tasks..."
                ) : error ? (
                  <li className="text-red-500">{error}</li>
                ) : tasks.length === 0 ? (
                  <li>No tasks assigned to you.</li>
                ) : (
                  tasks.map((task: TaskType) => (
                    <NavLink to={`/tasks/${task._id}`} key={task._id}>
                      <li className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                        <span className="font-medium">{task.title}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-md ${
                            task.status === "To Do"
                              ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                              : task.status === "In Progress"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100"
                              : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                          }`}
                        >
                          {task.status}
                        </span>
                      </li>
                    </NavLink>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Projects */}
          <div className="mt-4">
            <span className="block px-2 py-1 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">
              Projects
            </span>
            <ul className="ml-2 mt-2 space-y-2 text-xs">
              {orgProjects.map((project: Project) => (
                <li key={project.name}>
                  <button
                    onClick={() => toggleProject(project.name)}
                    className="w-full cursor-pointer flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
                  >
                    <span className="flex items-center gap-2">
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
                      {subItems.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={`${sub.path}/${project._id}`}
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

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          © 2025 SyncSpace
        </footer>
      </aside>

      <CreateOrganizationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreated={() => console.log("Organization created!")}
      />
    </>
  );
};

export default CSIASidebar;
