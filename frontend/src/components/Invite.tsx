import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AcceptInvitePage = () => {
  const { token } = useParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!name || !password) return alert("Please fill all fields");
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/organizationMember/accept-invite/${token}`,
        { name, password }
      );
      toast.success("🎉 You have joined the organization!");
      window.location.href = "/";
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen z-100 fixed inset-0 flex items-center justify-center bg-linear-to-br from-blue-100 via-indigo-200 to-blue-300 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          SyncSpace
        </h1>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <button
            onClick={handleAccept}
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
            }`}
          >
            {loading ? "Joining..." : "Join Organization"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
