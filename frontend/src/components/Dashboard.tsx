import { useEffect, type FC } from "react";
import {
  PlusCircle,
  CheckCircle,
  ListTodo,
  AlertTriangle,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
// import type { Project } from "../type";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchOrgProjects } from "../store/organization";
import { Link } from "react-router-dom";
import type { Task } from "../type";

const Dashboard: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedOrganization, orgProjects, loading } = useSelector(
    (state: RootState) => state.organization
  );
  const { user } = useSelector((state: RootState) => state.user);
   const { tasks, loading:taskloading, error } = useSelector((state: any) => state.myTask);

  useEffect(() => {
    if (selectedOrganization?._id) {
      dispatch(fetchOrgProjects(selectedOrganization._id));
    }
  }, [selectedOrganization, dispatch]);
  function getCompletedProject() {
    console.log(orgProjects.filter((project) => project.status == "Completed"));
    return orgProjects.filter((project) => project.status == "Completed")
      .length;
  }

  const overdueTasks = tasks.filter(
    (t:Task) => t.status === "To Do" && new Date(t.dueDate) < new Date()
  );
  const inProgressTasks = tasks.filter((t:Task) => t.status === "In Progress");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Here's what's happening with your projects today
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Total Project
              </span>
              <PlusCircle className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-semibold mt-2">{orgProjects.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              projects in {selectedOrganization?.name}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Completed Projects
              </span>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-semibold mt-2">
              {getCompletedProject()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              of {orgProjects.length} total
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                My Tasks
              </span>
              <ListTodo className="text-amber-500" size={20} />
            </div>
            <p className="text-3xl font-semibold mt-2">{tasks.length}</p>
            <p className="text-xs text-gray-400 mt-1">assigned to me</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Overdue</span>
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <p className="text-3xl font-semibold mt-2">{overdueTasks.length}</p>
            <p className="text-xs text-gray-400 mt-1">need attention</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row items-start">
        <div className="flex-1">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PlusCircle size={18} /> Project Overview
              </h2>
              <button className="text-blue-600 text-sm hover:underline">
                View all
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {orgProjects.map((project) => (
                <Link
                  to={`/settings/${project._id}`}
                  key={project._id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        project.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300"
                          : project.status === "Completed"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300"
                          : project.status === "Planning"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300"
                          : project.status === "On hold"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300"
                          : project.status === "Cancelled"
                          ? "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300"
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
                      <Users size={14} /> {project.members?.length || 0} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {project.startDate?.slice(0, 10)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Progress</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {project.progress || 0}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Clock size={18} /> Recent Activity
            </h2>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm flex flex-col gap-2">
              {tasks.map((task:Task, idx:string) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 py-2 last:border-none"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {task.status} • {task.type.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                      {task.assignee?.name}
                    </span>
                    {task.assignee && <p className="text-xs text-gray-400">{task.assignee.name}</p>}
                    <Clock size={14} className="text-gray-400" />
                    <p className="text-xs text-gray-400">{task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-72 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex flex-col gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ListTodo className="text-amber-500"  size={16} /> My Tasks
            </h3>
            <p className="text-3xl font-semibold">{tasks.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              assigned to me
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex flex-col gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={16} /> Overdue
            </h3>
            <p className="text-3xl font-semibold">{overdueTasks.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              need attention
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex flex-col gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="text-blue-500"  size={16} /> In Progress
            </h3>
            <p className="text-3xl font-semibold">{inProgressTasks.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              tasks ongoing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
