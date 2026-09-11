package com.saarthi.backend.dto;

import com.saarthi.backend.entity.Program;
import com.saarthi.backend.entity.User;

import java.time.LocalDateTime;

public class ProgramResponse {

    private Long id;
    private Long childId;
    private Long createdByUserId;
    private String creatorName;
    private String creatorEmail;
    private String title;
    private String description;
    private String category;
    private String frequency;
    private String targetGoal;
    private String status;
    private String startDate;
    private String endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProgramResponse(Program program) {
        this.id = program.getId();
        this.childId = program.getChildId();
        this.createdByUserId = program.getCreatedByUserId();
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.category = program.getCategory();
        this.frequency = program.getFrequency();
        this.targetGoal = program.getTargetGoal();
        this.status = program.getStatus();
        this.startDate = program.getStartDate() != null ? program.getStartDate().toString() : null;
        this.endDate = program.getEndDate() != null ? program.getEndDate().toString() : null;
        this.createdAt = program.getCreatedAt();
        this.updatedAt = program.getUpdatedAt();
    }

    public ProgramResponse(Program program, User creator) {
        this(program);
        if (creator != null) {
            this.creatorName = creator.getFirstName() + (creator.getLastName() != null ? " " + creator.getLastName() : "");
            this.creatorEmail = creator.getEmail();
        }
    }

    // Getters

    public Long getId() {
        return id;
    }

    public Long getChildId() {
        return childId;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public String getCreatorEmail() {
        return creatorEmail;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getFrequency() {
        return frequency;
    }

    public String getTargetGoal() {
        return targetGoal;
    }

    public String getStatus() {
        return status;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
