package com.example.dto;


public class ProjectProgressResponse {

    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;

    public ProjectProgressResponse(int totalTasks, int completedTasks) {
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.progressPercentage = totalTasks == 0
                ? 0
                : (completedTasks * 100.0) / totalTasks;
    }

    public int getTotalTasks() {
        return totalTasks;
    }

    public int getCompletedTasks() {
        return completedTasks;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }
}
