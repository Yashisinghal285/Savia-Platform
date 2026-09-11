package com.saarthi.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ProgressLogRequest {

    private Long programId;

    @NotBlank(message = "Session date is required")
    private String sessionDate; // YYYY-MM-DD

    private Integer durationMinutes;
    private String moodRating;
    private String performanceRating;
    private String milestoneAchieved;
    private String notes;
    private String challengesFaced;

    // Getters and Setters

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public String getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(String sessionDate) {
        this.sessionDate = sessionDate;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getMoodRating() {
        return moodRating;
    }

    public void setMoodRating(String moodRating) {
        this.moodRating = moodRating;
    }

    public String getPerformanceRating() {
        return performanceRating;
    }

    public void setPerformanceRating(String performanceRating) {
        this.performanceRating = performanceRating;
    }

    public String getMilestoneAchieved() {
        return milestoneAchieved;
    }

    public void setMilestoneAchieved(String milestoneAchieved) {
        this.milestoneAchieved = milestoneAchieved;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getChallengesFaced() {
        return challengesFaced;
    }

    public void setChallengesFaced(String challengesFaced) {
        this.challengesFaced = challengesFaced;
    }
}
