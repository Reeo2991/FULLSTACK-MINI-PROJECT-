import { http } from "../lib/http";
import { API } from "../config/api";
import type { Project, ID, ProgressResponse } from "../types/models";

/**
 * GET /projects
 */
export async function getProjects(): Promise<Project[]> {
  const res = await http.get<Project[]>(API.projects);
  return res.data;
}

/**
 * GET /projects/{id}
 */
export async function getProjectById(id: ID): Promise<Project> {
  const res = await http.get<Project>(API.projectById(id));
  return res.data;
}

/**
 * POST /projects
 */
export async function createProject(
  data: Pick<Project, "title" | "description">
): Promise<Project> {
  const res = await http.post<Project>(API.projects, data);
  return res.data;
}

export async function updateProject(
  id: ID,
  data: Pick<Project, "title" | "description">
): Promise<Project> {
  const res = await http.put<Project>(API.projectById(id), data);
  return res.data;
}


/**
 * DELETE /projects/{id}
 */
export async function deleteProject(id: ID): Promise<void> {
  await http.delete(API.projectById(id));
}

/**
 * GET /projects/{id}/progress
 */
export async function getProjectProgress(projectId: number) {
  const res = await http.get<ProgressResponse>(
    `/projects/${projectId}/progress`
  );
  return res.data;
}

