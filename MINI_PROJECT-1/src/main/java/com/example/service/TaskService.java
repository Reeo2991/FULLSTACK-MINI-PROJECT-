package com.example.service;


import com.example.dto.TaskRequest;
import com.example.dto.TaskResponse;
import com.example.Entity.Project;
import com.example.Entity.Task;
import com.example.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

import com.example.Repository.ProjectRepository;
import com.example.Repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public TaskResponse createTask(Long projectId, TaskRequest request) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setCompleted(false);
        task.setProject(project);

        taskRepository.save(task);

        return mapToResponse(task);
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {

        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Transactional
    public void completeTask(Long taskId, String email) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        Project project = task.getProject();
        if (project == null || project.getUser() == null) {
            throw new RuntimeException("Invalid task ownership");
        }

        if (!project.getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Task not found");
        }

        task.setCompleted(true);
        taskRepository.save(task);
    }



    public TaskResponse updateTask(Long taskId, TaskRequest request, String email) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getProject().getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Task not found");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        Task saved = taskRepository.save(task);

        return mapToResponse(saved);
    }

    public void deleteTask(Long taskId) {

        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }

    private TaskResponse mapToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.isCompleted()
        );
    }
}

