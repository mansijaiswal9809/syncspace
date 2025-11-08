import { type FC, useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import type { Task, User } from "../type";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: Task) => void;
}

const CreateTaskModal: FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { id: projectId } = useParams<{ id: string }>();
  const { selectedOrganization } = useSelector(
    (state: RootState) => state.organization
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Task["type"]>("Task");
  const [priority, setPriority] = useState<Task["priority"]>("Low");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState<Task["status"]>("To Do");
  const [dueDate, setDueDate] = useState("");
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchMembers = async () => {
      try {
        const res = await axios.get<{ members: User[] }>(
          `http://localhost:5000/api/projects/${projectId}`
        );
        setProjectMembers(res.data.members || []);
      } catch (err) {
        toast.error("Failed to fetch project members");
      }
    };

    fetchMembers();
  }, [projectId]);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setType("Task");
    setPriority("Low");
    setAssignee("");
    setStatus("To Do");
    setDueDate("");
    onClose();
  };

  const handleCreate = async () => {
    if (!title || !assignee || !dueDate) return;

    const taskData = {
      title,
      description,
      type,
      priority,
      assignee,
      status,
      dueDate,
      project: projectId,
      organization: selectedOrganization?._id,
    };

    try {
      setLoading(true);
      const res = await axios.post<Task>(
        "http://localhost:5000/api/tasks",
        taskData
      );
      onCreate(res.data);
      handleClose();
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Create New Task
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Task["type"])}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Task">Task</option>
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
                <option value="Improvement">Improvement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                Assignee <span className="text-red-500">*</span>
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select</option>
                {projectMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !title || !assignee || !dueDate}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
