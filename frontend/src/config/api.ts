// Base URL of your backend API
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Centralized API routes
export const API = {
  // AUTH
  login: "/auth/login",

  // PROJECTS
  projects: "/projects",
  projectById: (id: string | number) => `/projects/${id}`,
  projectTasks: (projectId: string | number) =>
    `/projects/${projectId}/tasks`,
  projectProgress: (projectId: string | number) =>
    `/projects/${projectId}/progress`,

  // TASKS
  taskById: (taskId: string | number) => `/tasks/${taskId}`,
};
