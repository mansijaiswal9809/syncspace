import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import Team from "./components/Team";
import TaskDiscussion from "./components/Task";
import ProjectDetails from "./components/ProjectDetails";
import Analytics from "./components/Analytics";
import ProjectCalendar from "./components/ProjectCalendar";
import ProjectSetting from "./components/ProjectSetting";

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/team" element={<Team />} />
              <Route path="/tasks/:id" element={<TaskDiscussion />} />
              <Route path="/project-details/:id" element={<ProjectDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<ProjectCalendar />} />
              <Route path="/settings/:id" element={<ProjectSetting />} />
              <Route path="/projects/login" element={<ProjectDetails />} />
              <Route path="/projects/footer" element={<ProjectDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
