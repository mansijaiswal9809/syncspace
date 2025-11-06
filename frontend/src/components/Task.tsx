import { useState, useEffect } from "react";
import type { FC } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MessageCircle, Clipboard, Info, Send } from "lucide-react";
import type { Task, User } from "../type";
interface Comment{
    user: User;
    message: string;
    createdAt: string;
  }

interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
}

const TaskDiscussionLayout: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axios.get<Task>(`http://localhost:5000/api/tasks/${id}`, {
          withCredentials: true,
        });

        setTask(res.data);

        if (res.data.comments && res.data.comments.length) {
          const formattedMessages = res.data.comments.map((c, index) => ({
            id: index + 1,
            user: c.user?.name || "Unknown",
            text: c.message,
            time: c.createdAt
              ? new Date(c.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSend = async () => {
    if (!input.trim() || !task) return;

    const newMessage: Message = {
      id: messages.length + 1,
      user: "You",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/tasks/${id}/comments`,
        { comments: input },
        { withCredentials: true }
      );
      if (res.data && res.data.comments) {
        const updated = res.data.comments.map((c: Comment , index: string) => ({
          id: index + 1,
          user: c.user?.name || "Unknown",
          text: c.message,
          time: c.createdAt
            ? new Date(c.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        }));
        setMessages(updated);
      } else {
        setMessages([...messages, newMessage]);
      }

      setInput("");
    } catch (err) {
      console.error("Error sending comment:", err);
    }
  };

  if (loading) return <p className="p-6">Loading task...</p>;
  if (!task) return <p className="p-6">Task not found</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl shadow-md">
      <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={20} className="text-blue-500" />
          <h2 className="text-lg font-semibold">
            Task Discussion ({messages.length})
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 max-h-96 space-y-3 min-h-[60vh]">
          {messages.length ? (
            messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {msg.user}
                  </span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 pl-6">
                  {msg.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-center mt-10">
              No messages yet. Start the discussion!
            </p>
          )}
        </div>

        <div className="flex gap-2 items-end">
          <textarea
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-2 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            rows={2}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSend())
            }
          />
          <button
            className="bg-blue-600 cursor-pointer min-w-20 h-[30px] hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center transition"
            onClick={handleSend}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 transition hover:shadow-xl">
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-2">
          <Clipboard size={22} className="text-green-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {task?.title}
          </h3>
        </div>

        <div className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300">
              {task?.status}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300">
              {task?.type}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-700/30 text-amber-700 dark:text-amber-300">
              {task?.priority}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow">
              {task.assignee?.name?.slice(0, 2)}
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {task.assignee?.name || "Unassigned"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              Due: {task.dueDate?.slice(0, 10) || "-"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Info size={20} className="text-amber-500" />
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Project Details
            </h4>
          </div>
          <div className="flex flex-col gap-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {task.project.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Project Start Date: {task.project.startDate?.slice(0, 10)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Status: {task.project.status}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Priority: HIGH
            </p>

            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Progress
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-500 to-green-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${task.project.progress || 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {task.project.progress}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDiscussionLayout;
