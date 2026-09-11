package com.saarthi.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateGuardianRoleRequest {

    @NotBlank(message = "Relationship type is required")
    private String relationshipType;

    public String getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(String relationshipType) {
        this.relationshipType = relationshipType;
    }
}
