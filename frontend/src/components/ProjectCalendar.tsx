import type { FC } from "react";
import {
  CheckCircle,
  Zap,
  Bug,
  PlusCircle,
} from "lucide-react";
import ProjectHeader from "./ProjectHeader";

const taskTypeMap = {
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
    color:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  OTHER: {
    icon: PlusCircle,
    color: "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
  },
};
interface Task {
  title: string;
  type: "TASK" | "BUG" | "IMPROVEMENT" | "FEATURE" | "OTHER";
  dueDate: string;
}

const ProjectCalendar: FC = () => {
  const tasks: Task[] = [
    { title: "integration", type: "TASK", dueDate: "2025-11-01" },
    { title: "resolve bug", type: "BUG", dueDate: "2025-11-05" },
    { title: "UI fix", type: "TASK", dueDate: "2025-11-06" },
  ];

  const month = "November";
  const year = 2025;
  const daysInMonth = 30;
  const firstDayOfWeek = new Date(`${year}-11-01`).getDay();

  const days: (number | null)[] = Array(firstDayOfWeek)
    .fill(null)
    .concat([...Array(daysInMonth).keys()].map((d) => d + 1));

  const taskMap: Record<number, Task[]> = {};
  tasks.forEach((task) => {
    const day = new Date(task.dueDate).getDate();
    if (!taskMap[day]) taskMap[day] = [];
    taskMap[day].push(task);
  });

  return (
    <div className=" lg:p-8 flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      <ProjectHeader />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-white flex-1 dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Task Calendar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {month} {year}
          </p>

          <div className="grid grid-cols-7 text-center font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 text-center gap-2">
            {days.map((day, i) => {
              const dayTasks = day ? taskMap[day] : null;
              return (
                <div
                  key={i}
                  className={`h-16 flex flex-col items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 
              ${
                day
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "bg-transparent border-none"
              }`}
                >
                  {day && <span className="font-medium">{day}</span>}
                  {dayTasks && (
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {dayTasks.length} {dayTasks.length > 1 ? "tasks" : "task"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 w-full lg:w-1/4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Upcoming Tasks
          </h2>
          <div className="space-y-3">
            {tasks.map((task, index) => {
              const typeInfo = taskTypeMap[task.type] || taskTypeMap["OTHER"];
              const Icon = typeInfo.icon;

              return (
                <div
                  key={index}
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {task.type}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCalendar;
