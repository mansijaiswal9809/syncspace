import { type FC, useState } from "react";
import AuthModal from "./LoginRegisterModal";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const Navbar: FC = () => {
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          SyncSpace
        </div>
      </div>
      {!user && (
        <button
          onClick={() => setShowAuth(true)}
          className=" cursor-pointer relative px-6 py-2.5 overflow-hidden rounded-lg bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-medium shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.03] focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <span className="relative z-10">Login</span>
          <span className="absolute inset-0 bg-white/10 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      )}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      {user && (
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-400 text-white flex items-center justify-center font-semibold">
            {user.name[0]}
          </div>
          <span className="hidden sm:block text-gray-900 dark:text-gray-100 font-medium">
            {user.name}
          </span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
