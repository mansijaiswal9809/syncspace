import { useState } from "react";
import {
  Plus,
  Circle,
  CheckCircle,
  ListTodo,
  Users,
  Loader2,
} from "lucide-react";
import CreateModal from "./AddNewTask";
import type { User } from "../type";

const ProjectHeader = ({
  team,
  projectName,
  status
}: {
  team: User[];
  projectName: string;
  status:string
}) => {
  const stats = [
    {
      label: "Total Tasks",
      value: 3,
      icon: ListTodo,
      color: "from-blue-500/10 to-blue-500/20 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Completed",
      value: 1,
      icon: CheckCircle,
      color:
        "from-green-500/10 to-green-500/20 text-green-600 dark:text-green-400",
    },
    {
      label: "In Progress",
      value: 2,
      icon: Loader2,
      color:
        "from-amber-500/10 to-amber-500/20 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Team Members",
      value: team.length,
      icon: Users,
      color:
        "from-purple-500/10 to-purple-500/20 text-purple-600 dark:text-purple-400",
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = (task: any) => {
    console.log("New Task:", task);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            {projectName}
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800">
              Project
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Circle className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Status:{" "}
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {status}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 active:scale-95 transition transform"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {item.value}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 ${item.color}`}
            >
              <item.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
};

export default ProjectHeader;
