import { useState } from "react";
import type { FC } from "react";
import { Send } from "lucide-react";

interface Comment {
  user: string;
  avatar: string;
  content: string;
  date: string;
}

interface Task {
  title: string;
  status: "TODO" | "IN PROGRESS" | "DONE";
  type: "TASK" | "BUG";
  priority: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  due: string;
  project: string;
  startDate: string;
  projectStatus: "PLANNING" | "ACTIVE" | "COMPLETED";
  projectPriority: "LOW" | "MEDIUM" | "HIGH";
  progress: number;
}

const TaskDiscussion: FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const task: Task = {
    title: "Ui",
    status: "TODO",
    type: "TASK",
    priority: "MEDIUM",
    description: "Beautiful UI",
    due: "06 Nov 2025",
    project: "Login",
    startDate: "24 Oct 2025",
    projectStatus: "PLANNING",
    projectPriority: "HIGH",
    progress: 0,
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      {
        user: "Mansi Jaiswal",
        avatar: "M",
        content: commentText,
        date: new Date().toLocaleString(),
      },
    ]);
    setCommentText("");
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "TODO":
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
      case "IN PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100";
      case "DONE":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100";
      case "HIGH":
        return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100";
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 h-screen overflow-y-auto">
      {/* Task Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {task.title}
        </h1>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span
            className={`px-2 py-1 rounded font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
          <span
            className={`px-2 py-1 rounded font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.type} • {task.priority} priority
          </span>
        </div>
      </div>

      {/* Task Description */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <p className="text-gray-800 dark:text-gray-100">{task.description}</p>
      </div>

      {/* Project Details */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Project Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium">Project:</span> {task.project}
          </div>
          <div>
            <span className="font-medium">Project Start Date:</span>{" "}
            {task.startDate}
          </div>
          <div>
            <span className="font-medium">Status:</span> {task.projectStatus}
          </div>
          <div>
            <span className="font-medium">Priority:</span>{" "}
            {task.projectPriority}
          </div>
          <div>
            <span className="font-medium">Progress:</span> {task.progress}%
          </div>
          <div>
            <span className="font-medium">Due:</span> {task.due}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Task Discussion ({comments.length})
        </h2>

        {/* Existing Comments */}
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No comments yet. Be the first!
          </p>
        ) : (
          <ul className="space-y-3 mb-4">
            {comments.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {c.avatar}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {c.user}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {c.content}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">
                    {c.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add Comment */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={addComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
          >
            <Send size={16} />
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDiscussion;
