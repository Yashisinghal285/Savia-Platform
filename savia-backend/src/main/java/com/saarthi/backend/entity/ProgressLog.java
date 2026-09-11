package com.saarthi.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress_logs")
public class ProgressLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_id", nullable = false)
    private Long childId;

    @Column(name = "program_id")
    private Long programId;

    @Column(name = "logged_by_user_id", nullable = false)
    private Long loggedByUserId;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "mood_rating")
    private String moodRating;

    @Column(name = "performance_rating")
    private String performanceRating;

    @Column(name = "milestone_achieved", columnDefinition = "TEXT")
    private String milestoneAchieved;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "challenges_faced", columnDefinition = "TEXT")
    private String challengesFaced;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChildId() {
        return childId;
    }

    public void setChildId(Long childId) {
        this.childId = childId;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public Long getLoggedByUserId() {
        return loggedByUserId;
    }

    public void setLoggedByUserId(Long loggedByUserId) {
        this.loggedByUserId = loggedByUserId;
    }

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
