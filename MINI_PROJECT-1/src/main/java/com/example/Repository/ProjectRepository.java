package com.example.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUser_Id(Long userId);
    Optional<Project> findByIdAndUser_Id(Long id, Long userId);

}