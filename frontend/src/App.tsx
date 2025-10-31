import "./App.css";
// import ProjectDetails from './components/ProjectDetails'
// import Dashboard from './components/Dashboard'
// import Projects from './components/Projects'
import Sidebar from "./components/sidebar";
// import TaskDiscussion from './components/Task'
// import Team from './components/Team'
// import Analytics from "./components/Analytics";
// import ProjectCalendar from "./components/ProjectCalendar";
import ProjectSetting from "./components/ProjectSetting";
function App() {
  return (
    <div className="flex">
      <Sidebar />
      {/* <Dashboard/> */}
      {/* <Projects/> */}
      {/* <Team/> */}
      {/* <TaskDiscussion/> */}
      {/* <ProjectDetails/> */}
      {/* <Analytics/> */}
      {/* <ProjectCalendar /> */}
      <ProjectSetting/>
    </div>
  );
}

export default App;
