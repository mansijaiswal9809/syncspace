import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import Team from "./components/Team";
import TaskDiscussionLayout from "./components/Task"; // TaskDiscussion component
import ProjectDetails from "./components/ProjectDetails";
import Analytics from "./components/Analytics";
import ProjectCalendar from "./components/ProjectCalendar";
import ProjectSetting from "./components/ProjectSetting";
import AcceptInvitePage from "./components/Invite"; // AcceptInvitePage
import { Toaster } from "react-hot-toast";
// import AuthModal from "./components/LoginRegisterModal";
import { useEffect, useState } from "react";
import { fetchUser } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import AuthModal from "./components/LoginRegisterModal";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(fetchUser());
      setLoading(false);
    };
    loadUser();
  }, [dispatch]);

  return (
    <Router>
      <div className="h-screen flex flex-col dark:bg-gray-900">
        <Toaster position="top-right" reverseOrder={false} />
        {!user && !loading && <AuthModal />}
        {user && (
          <>
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/tasks/:id" element={<TaskDiscussionLayout />} />
                  <Route
                    path="/project-details/:id"
                    element={<ProjectDetails />}
                  />
                  <Route path="/analytics/:id" element={<Analytics />} />
                  <Route path="/calendar/:id" element={<ProjectCalendar />} />
                  <Route path="/settings/:id" element={<ProjectSetting />} />
                  <Route
                    path="/accept-invite/:token"
                    element={<AcceptInvitePage />}
                  />
                </Routes>
              </main>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
