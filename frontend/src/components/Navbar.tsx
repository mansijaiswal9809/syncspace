import type { FC } from "react";

const Navbar: FC = () => {
  const userName = "Mansi Jaiswal";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          SyncSpace
        </div>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-400 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>
        <span className="hidden sm:block text-gray-900 dark:text-gray-100 font-medium">
          {userName}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
