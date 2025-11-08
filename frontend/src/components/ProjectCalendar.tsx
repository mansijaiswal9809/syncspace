import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  Zap,
  Bug,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import ProjectHeader from "./ProjectHeader";
import type { Project, Task } from "../type";
import toast from "react-hot-toast";

type TaskType = "TASK" | "BUG" | "FEATURE" | "OTHER";

const taskTypeMap: Record<
  TaskType,
  { icon: any; color: string }
> = {
  TASK: {
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  BUG: {
    icon: Bug,
    color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  FEATURE: {
    icon: Zap,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  OTHER: {
    icon: PlusCircle,
    color: "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
  },
};

const ProjectCalendar: FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  // Fetch project & tasks
  const fetchData = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const [taskRes, projectRes] = await Promise.all([
        axios.get<Task[]>(`http://localhost:5000/api/tasks/project/${projectId}`, {
          withCredentials: true,
        }),
        axios.get<Project>(`http://localhost:5000/api/projects/${projectId}`, {
          withCredentials: true,
        }),
      ]);
      setTasks(taskRes.data || []);
      setProject(projectRes.data);
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  // Month grid logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const days: (number | null)[] = Array(firstDayOfWeek)
    .fill(null)
    .concat([...Array(daysInMonth).keys()].map((d) => d + 1));

  // Filter tasks by visible month
  const tasksForMonth = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const date = new Date(task.dueDate);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  // Map tasks to days
  const taskMap: Record<number, Task[]> = {};
  tasksForMonth.forEach((task) => {
    if (!task.dueDate) return;
    const day = new Date(task.dueDate).getDate();
    if (!taskMap[day]) taskMap[day] = [];
    taskMap[day].push(task);
  });

  // Month navigation
  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else setMonth((prev) => prev - 1);
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else setMonth((prev) => prev + 1);
  };

  // Upcoming "To Do" tasks within 14 days
  const now = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(now.getDate() + 14);

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate || !task.status) return false;
    const due = new Date(task.dueDate);
    return (
      task.status.toLowerCase() === "to do" &&
      due >= now &&
      due <= twoWeeksLater
    );
  });

  // Stats for header
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "in progress"
  ).length;

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="lg:p-8 flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      <ProjectHeader
        projectName={project?.name || ""}
        status={project?.status || ""}
        totalTask={tasks.length}
        completedTask={completedTasks}
        inProgress={inProgressTasks}
        team={project?.members || []}
        onTaskCreated={fetchData}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <div className="bg-white flex-1 dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Task Calendar
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevMonth}
                className="p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {monthName} {year}
              </span>
              <button
                onClick={goToNextMonth}
                className="p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading tasks...</p>
          ) : (
            <>
              <div className="grid grid-cols-7 text-center font-medium text-gray-700 dark:text-gray-300 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 text-center gap-2">
                {days.map((day, i) => {
                  const dayTasks = day ? taskMap[day] : null;
                  return (
                    <div
                      key={i}
                      className={`h-20 flex flex-col items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 ${
                        day
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          : "bg-transparent border-none"
                      }`}
                    >
                      {day && <span className="font-medium">{day}</span>}
                      {dayTasks && (
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          {dayTasks.length}{" "}
                          {dayTasks.length > 1 ? "tasks" : "task"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Upcoming Tasks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 w-full lg:w-1/4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Clock size={18} /> Upcoming Tasks
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming To Do tasks.</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks
                .sort(
                  (a, b) =>
                    new Date(a.dueDate || "").getTime() -
                    new Date(b.dueDate || "").getTime()
                )
                .map((task) => {
                  const typeInfo =
                    taskTypeMap[task.type as TaskType] || taskTypeMap["OTHER"];
                  const Icon = typeInfo.icon;
                  return (
                    <div
                      key={task._id}
                      className="flex items-end justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${typeInfo.color} flex items-center justify-center`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {task.title}
                          </p>
                          {task.dueDate && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Due:{" "}
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCalendar;
