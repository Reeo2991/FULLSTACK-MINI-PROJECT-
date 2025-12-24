package com.example.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.dto.TaskRequest;
import com.example.dto.TaskResponse;
import com.example.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ✅ POST /projects/{id}/tasks
    @PostMapping("/projects/{projectId}/tasks")
    public TaskResponse createTask(
            @PathVariable Long projectId,
            @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        return taskService.createTask(projectId, request);
    }

    // ✅ GET /projects/{id}/tasks
    @GetMapping("/projects/{projectId}/tasks")
    public List<TaskResponse> getTasks(
            @PathVariable Long projectId
    ) {
        return taskService.getTasksByProject(projectId);
    }

    @PatchMapping("/tasks/{taskId}/complete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void completeTask(
            @PathVariable Long taskId,
            Authentication authentication
    ) {
        if (authentication == null) {
            throw new RuntimeException("Unauthenticated");
        }
        taskService.completeTask(taskId, authentication.getName());
    }

    @PutMapping("/tasks/{taskId}")
    public TaskResponse updateTask(
            @PathVariable Long taskId,
            @RequestBody @Valid TaskRequest request,
            Authentication authentication
    ) {
        return taskService.updateTask(
                taskId,
                request,
                authentication.getName()
        );
    }

    // ✅ DELETE /tasks/{id}
    @DeleteMapping("/tasks/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
    }
}
