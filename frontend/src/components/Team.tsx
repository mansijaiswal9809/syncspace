import type { FC } from "react";
import { UserPlus, Search } from "lucide-react";

const Team: FC = () => {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 h-screen overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Team
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage team members and their contributions
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
            <UserPlus size={18} />
            Invite Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
            <p className="text-3xl font-semibold mt-1 text-gray-900 dark:text-gray-100">
              1
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Projects</p>
            <p className="text-3xl font-semibold mt-1 text-gray-900 dark:text-gray-100">
              2
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
            <p className="text-3xl font-semibold mt-1 text-gray-900 dark:text-gray-100">
              3
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 w-full sm:w-1/2">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
              <tr>
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  Mansi Jaiswal
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                  the.mansi.jaiswal@gmail.com
                </td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300 px-3 py-1 text-xs rounded-full font-medium">
                    ADMIN
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Team;
