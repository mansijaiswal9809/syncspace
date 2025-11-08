import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ProjectHeader from "./ProjectHeader";
import AddMemberModal from "./AddMemberModal";
import type { Organization, Project, User, Task } from "../type";
import { fetchOrgProjects } from "../store/organization";
import type { AppDispatch, RootState } from "../store/store";
import toast from "react-hot-toast";

const ProjectSetting: FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const selectedOrg: Organization | null = useSelector(
    (state: any) => state.organization?.selectedOrganization
  );

  const { selectedOrganization } = useSelector(
    (state: RootState) => state.organization
  );
  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const taskRes = await axios.get<Task[]>(
        `http://localhost:5000/api/tasks/project/${id}`,
        { withCredentials: true }
      );
      setTasks(taskRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const closeModal = async () => {
    setShowModal(false);
    fetchData();
  };

  // Fetch project & its tasks
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        setLoading(true);

        const [projectRes, tasksRes] = await Promise.all([
          axios.get<Project>(`http://localhost:5000/api/projects/${id}`),
          axios.get<Task[]>(`http://localhost:5000/api/tasks/project/${id}`),
        ]);

        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        toast.error("Error fetching project or tasks");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProjectAndTasks();
  }, [id]);

  // Calculate task metrics
  const totalTask = tasks.length;
  const completedTask = tasks.filter(
    (t) => t.status?.toLowerCase() === "done"
  ).length;
  const inProgress = tasks.filter(
    (t) => t.status?.toLowerCase() === "in progress"
  ).length;

  // Handle input updates
  const handleChange = (key: keyof Project, value: string | number) => {
    setProject((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // Add Members Handler
  const handleAddMembers = async (newMembers: User[]) => {
    if (!project) return;

    const updatedMembers = [
      ...project.members,
      ...newMembers.filter(
        (m) => !project.members.some((p) => p._id === m._id)
      ),
    ];

    const updatedProject = { ...project, members: updatedMembers };

    try {
      await axios.patch(
        `http://localhost:5000/api/projects/${id}`,
        updatedProject
      );
      setProject(updatedProject);
      setShowModal(false);
    } catch (error) {
      // console.error("Error adding members:", error);
      toast.error("Failed to add members.");
    }
  };

  // Progress Slider
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("progress", parseInt(e.target.value, 10));
  };

  // Save Changes
  const handleSaveChanges = async () => {
    if (!project) return;
    try {
      setSaving(true);
      await axios.patch(`http://localhost:5000/api/projects/${id}`, project);
      if (selectedOrganization) {
        // console.log("xyz");
        dispatch(fetchOrgProjects(selectedOrganization._id));
      }
      toast.success("Project updated successfully!");
    } catch (error) {
      // console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-8">
      {/* Dynamic Header */}
      <ProjectHeader
        projectName={project.name}
        team={project.members}
        status={project.status}
        completedTask={completedTask}
        inProgress={inProgress}
        totalTask={totalTask}
        onTaskCreated={fetchData}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* === Project Details === */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-6 transition-all hover:shadow-lg">
          <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
            Project Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Project Name
              </label>
              <input
                type="text"
                value={project.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Status</label>
              <select
                value={project.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
              >
                <option>Planning</option>
                <option>Active</option>
                <option>On Hold</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Priority</label>
              <select
                value={project.priority || ""}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={
                  project?.startDate ? project.startDate.split("T")[0] : ""
                }
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">End Date</label>
              <input
                type="date"
                value={project?.endDate ? project.endDate.split("T")[0] : ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <textarea
              value={project.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition min-h-[100px]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Progress: {project.progress || 0}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={project.progress || 0}
              onChange={handleProgressChange}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="w-full sm:w-auto cursor-pointer mt-4 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* === Team Members === */}
        <div className="w-full lg:w-[30%] bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-4 transition-all hover:shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Team Members ({project.members.length})
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 bg-green-600 cursor-pointer text-white rounded-md text-sm hover:bg-green-700 transition"
            >
              + Add
            </button>
          </div>

          <ul className="space-y-2">
            {project.members.length > 0 ? (
              project.members.map((member) => {
                const isLead = member._id === project.lead;
                return (
                  <li
                    key={member._id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isLead ? "Lead" : "Member"}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        isLead
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300"
                      }`}
                    >
                      {isLead ? "Lead" : "Member"}
                    </span>
                  </li>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No members yet.</p>
            )}
          </ul>
        </div>
      </div>

      {showModal && project && (
        <AddMemberModal
          projectName={project.name}
          existingMembers={project.members}
          allUsers={selectedOrg?.members || []}
          onAddMembers={handleAddMembers}
          onClose={closeModal}
          projectId={project._id}
        />
      )}
    </div>
  );
};

export default ProjectSetting;
