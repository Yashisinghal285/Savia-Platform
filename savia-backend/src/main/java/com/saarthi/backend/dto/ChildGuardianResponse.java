package com.saarthi.backend.dto;

import com.saarthi.backend.entity.ChildGuardian;
import com.saarthi.backend.entity.User;

import java.time.LocalDateTime;

public class ChildGuardianResponse {

    private Long id;
    private Long childId;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String relationshipType;
    private LocalDateTime createdAt;

    public ChildGuardianResponse(ChildGuardian link) {
        this.id = link.getId();
        this.childId = link.getChildId();
        this.userId = link.getUserId();
        this.relationshipType = link.getRelationshipType();
        this.createdAt = link.getCreatedAt();
    }

    public ChildGuardianResponse(ChildGuardian link, User user) {
        this.id = link.getId();
        this.childId = link.getChildId();
        this.userId = link.getUserId();
        this.relationshipType = link.getRelationshipType();
        this.createdAt = link.getCreatedAt();
        if (user != null) {
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.email = user.getEmail();
        }
    }

    public Long getId() {
        return id;
    }

    public Long getChildId() {
        return childId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRelationshipType() {
        return relationshipType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}