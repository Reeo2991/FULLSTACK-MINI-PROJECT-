package com.example.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.example.dto.ProjectProgressResponse;
import com.example.dto.ProjectRequest;
import com.example.dto.ProjectResponse;
import com.example.service.ProjectService;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // ✅ POST /projects
    @PostMapping
    public ProjectResponse createProject(
            @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        return projectService.createProject(
                request,
                authentication.getName()
        );
    }

    // ✅ GET /projects
    @GetMapping
    public List<ProjectResponse> getProjects(Authentication authentication) {
        return projectService.getUserProjects(authentication.getName());
    }

    // ✅ GET /projects/{id}
    @GetMapping("/{projectId}")
    public ProjectResponse getProjectById(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        return projectService.getProjectById(
                projectId,
                authentication.getName()
        );
    }

    // ✅ GET /projects/{id}/progress
    @GetMapping("/{projectId}/progress")
    public ProjectProgressResponse getProgress(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        return projectService.getProjectProgress(
                projectId,
                authentication.getName()
        );
    }
 // ✅ DELETE /projects/{id}
    @DeleteMapping("/{projectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        projectService.deleteProject(
                projectId,
                authentication.getName()
        );
    }

 // ✅ PUT /projects/{id}
    @PutMapping("/{projectId}")
    public ProjectResponse updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        return projectService.updateProject(
                projectId,
                request,
                authentication.getName()
        );
    }

    
}
