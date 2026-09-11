package com.saarthi.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "child_needs_profiles")
public class ChildNeedsProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_id", nullable = false, unique = true)
    private Long childId;

    @Column(name = "primary_diagnosis")
    private String primaryDiagnosis;

    @Column(name = "secondary_diagnosis")
    private String secondaryDiagnosis;

    @Column(name = "severity_level")
    private String severityLevel;

    @Column(name = "communication_mode")
    private String communicationMode;

    @Column(name = "mobility_status")
    private String mobilityStatus;

    @Column(name = "dietary_restrictions", columnDefinition = "TEXT")
    private String dietaryRestrictions;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "behavioral_triggers", columnDefinition = "TEXT")
    private String behavioralTriggers;

    @Column(name = "calming_strategies", columnDefinition = "TEXT")
    private String calmingStrategies;

    @Column(name = "emergency_medications", columnDefinition = "TEXT")
    private String emergencyMedications;

    @Column(name = "medical_notes", columnDefinition = "TEXT")
    private String medicalNotes;

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

    public String getPrimaryDiagnosis() {
        return primaryDiagnosis;
    }

    public void setPrimaryDiagnosis(String primaryDiagnosis) {
        this.primaryDiagnosis = primaryDiagnosis;
    }

    public String getSecondaryDiagnosis() {
        return secondaryDiagnosis;
    }

    public void setSecondaryDiagnosis(String secondaryDiagnosis) {
        this.secondaryDiagnosis = secondaryDiagnosis;
    }

    public String getSeverityLevel() {
        return severityLevel;
    }

    public void setSeverityLevel(String severityLevel) {
        this.severityLevel = severityLevel;
    }

    public String getCommunicationMode() {
        return communicationMode;
    }

    public void setCommunicationMode(String communicationMode) {
        this.communicationMode = communicationMode;
    }

    public String getMobilityStatus() {
        return mobilityStatus;
    }

    public void setMobilityStatus(String mobilityStatus) {
        this.mobilityStatus = mobilityStatus;
    }

    public String getDietaryRestrictions() {
        return dietaryRestrictions;
    }

    public void setDietaryRestrictions(String dietaryRestrictions) {
        this.dietaryRestrictions = dietaryRestrictions;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getBehavioralTriggers() {
        return behavioralTriggers;
    }

    public void setBehavioralTriggers(String behavioralTriggers) {
        this.behavioralTriggers = behavioralTriggers;
    }

    public String getCalmingStrategies() {
        return calmingStrategies;
    }

    public void setCalmingStrategies(String calmingStrategies) {
        this.calmingStrategies = calmingStrategies;
    }

    public String getEmergencyMedications() {
        return emergencyMedications;
    }

    public void setEmergencyMedications(String emergencyMedications) {
        this.emergencyMedications = emergencyMedications;
    }

    public String getMedicalNotes() {
        return medicalNotes;
    }

    public void setMedicalNotes(String medicalNotes) {
        this.medicalNotes = medicalNotes;
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
