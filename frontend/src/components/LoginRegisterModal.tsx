import { type FC, type ChangeEvent, type FormEvent, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );
        console.log("Logged in user:", res.data);
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/users/register",
          { ...formData, role: "admin" },
          { withCredentials: true }
        );
        console.log("Registered user:", res.data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-md bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <X size={22} />
            </button>

            <h2 className="text-3xl font-semibold text-center mb-6 bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            {error && (
              <p className="text-red-500 text-center text-sm mb-3">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 bg-linear-to-r cursor-pointer from-blue-500 to-indigo-600 text-white font-medium py-2 rounded-lg hover:opacity-90 transition"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            <div className="text-center mt-5 text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 cursor-pointer font-medium hover:underline"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 cursor-pointer font-medium hover:underline"
                  >
                    Login here
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
