package com.saarthi.backend.dto;

import com.saarthi.backend.entity.ChildNeedsProfile;

import java.time.LocalDateTime;

public class ChildNeedsProfileResponse {

    private Long id;
    private Long childId;
    private String primaryDiagnosis;
    private String secondaryDiagnosis;
    private String severityLevel;
    private String communicationMode;
    private String mobilityStatus;
    private String dietaryRestrictions;
    private String allergies;
    private String behavioralTriggers;
    private String calmingStrategies;
    private String emergencyMedications;
    private String medicalNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ChildNeedsProfileResponse(ChildNeedsProfile profile) {
        this.id = profile.getId();
        this.childId = profile.getChildId();
        this.primaryDiagnosis = profile.getPrimaryDiagnosis();
        this.secondaryDiagnosis = profile.getSecondaryDiagnosis();
        this.severityLevel = profile.getSeverityLevel();
        this.communicationMode = profile.getCommunicationMode();
        this.mobilityStatus = profile.getMobilityStatus();
        this.dietaryRestrictions = profile.getDietaryRestrictions();
        this.allergies = profile.getAllergies();
        this.behavioralTriggers = profile.getBehavioralTriggers();
        this.calmingStrategies = profile.getCalmingStrategies();
        this.emergencyMedications = profile.getEmergencyMedications();
        this.medicalNotes = profile.getMedicalNotes();
        this.createdAt = profile.getCreatedAt();
        this.updatedAt = profile.getUpdatedAt();
    }

    // Getters

    public Long getId() {
        return id;
    }

    public Long getChildId() {
        return childId;
    }

    public String getPrimaryDiagnosis() {
        return primaryDiagnosis;
    }

    public String getSecondaryDiagnosis() {
        return secondaryDiagnosis;
    }

    public String getSeverityLevel() {
        return severityLevel;
    }

    public String getCommunicationMode() {
        return communicationMode;
    }

    public String getMobilityStatus() {
        return mobilityStatus;
    }

    public String getDietaryRestrictions() {
        return dietaryRestrictions;
    }

    public String getAllergies() {
        return allergies;
    }

    public String getBehavioralTriggers() {
        return behavioralTriggers;
    }

    public String getCalmingStrategies() {
        return calmingStrategies;
    }

    public String getEmergencyMedications() {
        return emergencyMedications;
    }

    public String getMedicalNotes() {
        return medicalNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
