package com.saarthi.backend.dto;

import com.saarthi.backend.entity.ProgressLog;
import com.saarthi.backend.entity.Program;
import com.saarthi.backend.entity.User;

import java.time.LocalDateTime;

public class ProgressLogResponse {

    private Long id;
    private Long childId;
    private Long programId;
    private String programTitle;
    private Long loggedByUserId;
    private String loggerName;
    private String loggerEmail;
    private String sessionDate;
    private Integer durationMinutes;
    private String moodRating;
    private String performanceRating;
    private String milestoneAchieved;
    private String notes;
    private String challengesFaced;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProgressLogResponse(ProgressLog log) {
        this.id = log.getId();
        this.childId = log.getChildId();
        this.programId = log.getProgramId();
        this.loggedByUserId = log.getLoggedByUserId();
        this.sessionDate = log.getSessionDate().toString();
        this.durationMinutes = log.getDurationMinutes();
        this.moodRating = log.getMoodRating();
        this.performanceRating = log.getPerformanceRating();
        this.milestoneAchieved = log.getMilestoneAchieved();
        this.notes = log.getNotes();
        this.challengesFaced = log.getChallengesFaced();
        this.createdAt = log.getCreatedAt();
        this.updatedAt = log.getUpdatedAt();
    }

    public ProgressLogResponse(ProgressLog log, User logger, Program program) {
        this(log);
        if (logger != null) {
            this.loggerName = logger.getFirstName() + (logger.getLastName() != null ? " " + logger.getLastName() : "");
            this.loggerEmail = logger.getEmail();
        }
        if (program != null) {
            this.programTitle = program.getTitle();
        }
    }

    // Getters

    public Long getId() {
        return id;
    }

    public Long getChildId() {
        return childId;
    }

    public Long getProgramId() {
        return programId;
    }

    public String getProgramTitle() {
        return programTitle;
    }

    public Long getLoggedByUserId() {
        return loggedByUserId;
    }

    public String getLoggerName() {
        return loggerName;
    }

    public String getLoggerEmail() {
        return loggerEmail;
    }

    public String getSessionDate() {
        return sessionDate;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public String getMoodRating() {
        return moodRating;
    }

    public String getPerformanceRating() {
        return performanceRating;
    }

    public String getMilestoneAchieved() {
        return milestoneAchieved;
    }

    public String getNotes() {
        return notes;
    }

    public String getChallengesFaced() {
        return challengesFaced;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
