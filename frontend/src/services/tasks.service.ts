import { http } from "../lib/http";
import { API } from "../config/api";
import type { Task, ID } from "../types/models";

/**
 * GET /projects/{id}/tasks
 */
export async function getTasksByProject(
  projectId: ID
): Promise<Task[]> {
  const res = await http.get<Task[]>(
    API.projectTasks(projectId)
  );
  return res.data;
}

/**
 * POST /projects/{id}/tasks
 * Added optional fields to satisfy @Valid backend requirements
 */
export async function createTask(
  projectId: ID,
  data: { title: string; description?: string; dueDate?: string }
): Promise<Task> {
  const res = await http.post<Task>(
    API.projectTasks(projectId),
    data // Send the whole object instead of just { title }
  );
  return res.data;
}

/**
 * PUT /tasks/{taskId}
 * Ensure we send clean data to the @Valid endpoint
 */
export async function updateTask(
  taskId: number,
  data: {
    title: string;
    description: string;
    dueDate: string;
  }
): Promise<Task> {
  const res = await http.put<Task>(
    `/tasks/${taskId}`,
    data
  );
  return res.data;
}

/**
 * PATCH /tasks/{taskId}/complete
 * ⚠️ MUST send null body (backend expects NO body)
 */

export async function completeTask(
  taskId: number
): Promise<void> {
  await http.patch(
    `/tasks/${taskId}/complete`,
    null // ✅ CRITICAL: no body
  );
}



/**
 * DELETE /tasks/{taskId}
 */
export async function deleteTask(
  taskId: ID
): Promise<void> {
  await http.delete(
    API.taskById(taskId)
  );
}
