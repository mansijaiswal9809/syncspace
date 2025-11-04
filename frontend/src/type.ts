// User type
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "Lead";
}

// Organization type
export interface Organization {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  createdBy: string; // User ID
  admin: User[];
  members: User[];
  createdAt: string;
  updatedAt: string;
}

// Project type
export interface Project {
  _id: string;
  workspace: string; // Organization ID
  name: string;
  description: string;
  status: "Planning" | "Active" | "Completed" | "On hold" | "Cancelled";
  priority: "Low" | "Medium" | "High";
  startDate?: string;
  endDate?: string;
  lead?: User | null | string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  members:User[]
}

// Task type
export interface Task {
  _id: string;
  title: string;
  project: Project;
  description?: string;
  type: "Task" | "Bug" | "Feature" | "Improvement" | "Other";
  priority: "Low" | "Medium" | "High";
  assignee?: User | null;
  status: "To Do" | "In Progress" | "Done";
  dueDate?: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
  comments?: {
    user: User;
    message: string;
    createdAt: string;
  }[];
}

// Redux store slice example
export interface OrganizationState {
  selectedOrganization: Organization | null;
  loading: boolean;
}

export interface UserState {
  user: User | null;
  loading: boolean;
}
