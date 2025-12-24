// Shared ID type
export type ID = number | string;

/* =========================
   AUTH
========================= */
export type LoginResponse = {
  token: string;
};

/* =========================
   PROJECT
========================= */
export type Id = number;

export type Project = {
  id: ID;
  title: string;        
  description: string;
};

export type ProjectProgressResponse = {
  progress: number;
};


/* =========================
   TASK
========================= */
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
};


/* =========================
   PROGRESS
========================= */
export type ProgressResponse = {
  totalTasks: number;
  completedTasks: number;
  
};
