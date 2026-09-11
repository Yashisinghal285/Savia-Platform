package com.saarthi.backend.dto;

import java.util.List;
import java.util.Map;

public class ChildDashboardResponse {

    private Long childId;
    private String firstName;
    private String lastName;
    private String fullName;
    private Integer age;
    private String gender;
    private String dateOfBirth;
    private String disabilityType;
    private String additionalNeeds;

    private ChildNeedsProfileResponse needsProfile;
    private List<ChildGuardianResponse> careTeam;

    private int totalProgramsCount;
    private int activeProgramsCount;
    private int completedProgramsCount;
    private List<ProgramResponse> activePrograms;

    private int totalSessionsLogged;
    private int totalMinutesLogged;
    private List<ProgressLogResponse> recentSessions;
    private Map<String, Long> moodDistribution;
    private Map<String, Long> performanceDistribution;

    public ChildDashboardResponse() {
    }

    // Getters and Setters

    public Long getChildId() {
        return childId;
    }

    public void setChildId(Long childId) {
        this.childId = childId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getDisabilityType() {
        return disabilityType;
    }

    public void setDisabilityType(String disabilityType) {
        this.disabilityType = disabilityType;
    }

    public String getAdditionalNeeds() {
        return additionalNeeds;
    }

    public void setAdditionalNeeds(String additionalNeeds) {
        this.additionalNeeds = additionalNeeds;
    }

    public ChildNeedsProfileResponse getNeedsProfile() {
        return needsProfile;
    }

    public void setNeedsProfile(ChildNeedsProfileResponse needsProfile) {
        this.needsProfile = needsProfile;
    }

    public List<ChildGuardianResponse> getCareTeam() {
        return careTeam;
    }

    public void setCareTeam(List<ChildGuardianResponse> careTeam) {
        this.careTeam = careTeam;
    }

    public int getTotalProgramsCount() {
        return totalProgramsCount;
    }

    public void setTotalProgramsCount(int totalProgramsCount) {
        this.totalProgramsCount = totalProgramsCount;
    }

    public int getActiveProgramsCount() {
        return activeProgramsCount;
    }

    public void setActiveProgramsCount(int activeProgramsCount) {
        this.activeProgramsCount = activeProgramsCount;
    }

    public int getCompletedProgramsCount() {
        return completedProgramsCount;
    }

    public void setCompletedProgramsCount(int completedProgramsCount) {
        this.completedProgramsCount = completedProgramsCount;
    }

    public List<ProgramResponse> getActivePrograms() {
        return activePrograms;
    }

    public void setActivePrograms(List<ProgramResponse> activePrograms) {
        this.activePrograms = activePrograms;
    }

    public int getTotalSessionsLogged() {
        return totalSessionsLogged;
    }

    public void setTotalSessionsLogged(int totalSessionsLogged) {
        this.totalSessionsLogged = totalSessionsLogged;
    }

    public int getTotalMinutesLogged() {
        return totalMinutesLogged;
    }

    public void setTotalMinutesLogged(int totalMinutesLogged) {
        this.totalMinutesLogged = totalMinutesLogged;
    }

    public List<ProgressLogResponse> getRecentSessions() {
        return recentSessions;
    }

    public void setRecentSessions(List<ProgressLogResponse> recentSessions) {
        this.recentSessions = recentSessions;
    }

    public Map<String, Long> getMoodDistribution() {
        return moodDistribution;
    }

    public void setMoodDistribution(Map<String, Long> moodDistribution) {
        this.moodDistribution = moodDistribution;
    }

    public Map<String, Long> getPerformanceDistribution() {
        return performanceDistribution;
    }

    public void setPerformanceDistribution(Map<String, Long> performanceDistribution) {
        this.performanceDistribution = performanceDistribution;
    }
}
