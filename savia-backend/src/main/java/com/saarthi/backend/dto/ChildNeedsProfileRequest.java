package com.saarthi.backend.dto;

public class ChildNeedsProfileRequest {

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

    // Getters and Setters

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
}
