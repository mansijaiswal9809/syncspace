import type { FC } from "react";
import { Plus } from "lucide-react";

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
    <div className="p-8 flex-1 bg-gray-50 dark:bg-gray-900 h-screen overflow-y-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Login Project</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status: PLANNING</p>
        </div>

        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Summary Info */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: 3 },
          { label: "Completed", value: 1 },
          { label: "In Progress", value: 2 },
          { label: "Team Members", value: 1 },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Task Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Task Calendar</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">{month} {year}</p>

        {/* Week Headers */}
        <div className="grid grid-cols-7 text-center font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 text-center gap-2">
          {days.map((day, i) => {
            const dayTasks = day ? taskMap[day] : null;
            return (
              <div
                key={i}
                className={`h-16 flex flex-col items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 
                ${day ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" : "bg-transparent border-none"}`}
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

      {/* Upcoming Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Tasks</h2>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{task.type}</p>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCalendar;
