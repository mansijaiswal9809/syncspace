import { type FC, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { UserPlus, Users, FolderKanban } from "lucide-react";

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const Team: FC = () => {
  const { selectedOrganization, orgProjects, loading } = useSelector(
    (state: RootState) => state.organization
  );
  const { user } = useSelector((state: RootState) => state.user);

  // ✅ Ensure members array is always clean
  const members: Member[] = useMemo(
    () =>
      (selectedOrganization?.members || []).map((m: any) => ({
        _id: m._id || "",
        name: m.name || "Unknown",
        email: m.email || "",
        role: m.role || "MEMBER",
      })),
    [selectedOrganization]
  );

  const activeProjects =
    orgProjects?.filter((p: any) => p.status === "Active").length || 0;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-300">Loading team data...</p>
      </div>
    );

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
              Manage{" "}
              {selectedOrganization?.name
                ? selectedOrganization.name
                : "your organization"}{" "}
              members and their roles
            </p>
          </div>
          <button className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
            <UserPlus size={18} />
            Invite Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Members"
            value={members.length}
            color="blue"
          />
          <StatCard
            icon={<FolderKanban className="w-6 h-6" />}
            label="Active Projects"
            value={activeProjects}
            color="emerald"
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
              {members.length > 0 ? (
                members.map((member) => (
                  <tr
                    key={member._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      {member.name}
                      {member._id === user?._id && (
                        <span className="ml-2 text-xs text-blue-500 dark:text-blue-400 font-semibold">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {member.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          member.role === "ADMIN"
                            ? "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No team members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Stat Card Component
const StatCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}> = ({ icon, label, value, color }) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    emerald:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
      <div className={`p-3 rounded-xl border ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p
          className={`text-3xl font-semibold mt-1 ${
            color === "blue"
              ? "text-blue-600 dark:text-blue-400"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default Team;
