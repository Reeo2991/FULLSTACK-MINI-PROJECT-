package com.example.service;

import com.example.dto.ProjectProgressResponse;
import com.example.dto.ProjectRequest;
import com.example.dto.ProjectResponse;
import com.example.Entity.Project;
import com.example.Entity.User;
import com.example.exception.ResourceNotFoundException;
import com.example.Repository.ProjectRepository;
import com.example.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

 
    public ProjectResponse getProjectById(Long projectId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository
                .findByIdAndUser_Id(projectId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription()
        );
    }

    public ProjectResponse createProject(ProjectRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUser(user);

        projectRepository.save(project);

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription()
        );
    }
    public ProjectResponse updateProject(
            Long projectId,
            ProjectRequest request,
            String email
    ) {
    	User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Project project = projectRepository
                .findByIdAndUser_Id(projectId, user.getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        Project saved = projectRepository.save(project);

        return new ProjectResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription()
        );
    }
    public void deleteProject(Long projectId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository
                .findByIdAndUser_Id(projectId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        projectRepository.delete(project);
    }



    /**
     * Get all projects of authenticated user
     */
    public List<ProjectResponse> getUserProjects(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return projectRepository.findByUser_Id(user.getId())
                .stream()
                .map(project -> new ProjectResponse(
                        project.getId(),
                        project.getTitle(),
                        project.getDescription()
                ))
                .toList();
    }


    public ProjectProgressResponse getProjectProgress(Long projectId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository
                .findByIdAndUser_Id(projectId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        int total = project.getTasks().size();
        int completed = (int) project.getTasks()
                .stream()
                .filter(task -> task.isCompleted())
                .count();

        return new ProjectProgressResponse(total, completed);
    }
}
