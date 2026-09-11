package com.saarthi.backend.dto;

import java.util.List;

public class UserDashboardResponse {

    private Long userId;
    private String email;
    private String fullName;
    private String role;
    private int totalChildren;
    private int asGuardianCount;
    private int asCaregiverCount;
    private int asTherapistCount;
    private int totalActivePrograms;
    private int totalSessionsLast7Days;
    private List<ChildSummaryDto> children;
    private List<ProgressLogResponse> recentSessions;

    // Static nested DTO for concise child summaries
    public static class ChildSummaryDto {
        private Long childId;
        private String firstName;
        private String lastName;
        private String fullName;
        private Integer age;
        private String gender;
        private String relationshipType;
        private String primaryDiagnosis;
        private int activeProgramsCount;
        private String lastSessionDate;

        public ChildSummaryDto(Long childId, String firstName, String lastName, Integer age, String gender,
                               String relationshipType, String primaryDiagnosis, int activeProgramsCount, String lastSessionDate) {
            this.childId = childId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.fullName = firstName + (lastName != null ? " " + lastName : "");
            this.age = age;
            this.gender = gender;
            this.relationshipType = relationshipType;
            this.primaryDiagnosis = primaryDiagnosis;
            this.activeProgramsCount = activeProgramsCount;
            this.lastSessionDate = lastSessionDate;
        }

        public Long getChildId() {
            return childId;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public String getFullName() {
            return fullName;
        }

        public Integer getAge() {
            return age;
        }

        public String getGender() {
            return gender;
        }

        public String getRelationshipType() {
            return relationshipType;
        }

        public String getPrimaryDiagnosis() {
            return primaryDiagnosis;
        }

        public int getActiveProgramsCount() {
            return activeProgramsCount;
        }

        public String getLastSessionDate() {
            return lastSessionDate;
        }
    }

    public UserDashboardResponse() {
    }

    // Getters and Setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getTotalChildren() {
        return totalChildren;
    }

    public void setTotalChildren(int totalChildren) {
        this.totalChildren = totalChildren;
    }

    public int getAsGuardianCount() {
        return asGuardianCount;
    }

    public void setAsGuardianCount(int asGuardianCount) {
        this.asGuardianCount = asGuardianCount;
    }

    public int getAsCaregiverCount() {
        return asCaregiverCount;
    }

    public void setAsCaregiverCount(int asCaregiverCount) {
        this.asCaregiverCount = asCaregiverCount;
    }

    public int getAsTherapistCount() {
        return asTherapistCount;
    }

    public void setAsTherapistCount(int asTherapistCount) {
        this.asTherapistCount = asTherapistCount;
    }

    public int getTotalActivePrograms() {
        return totalActivePrograms;
    }

    public void setTotalActivePrograms(int totalActivePrograms) {
        this.totalActivePrograms = totalActivePrograms;
    }

    public int getTotalSessionsLast7Days() {
        return totalSessionsLast7Days;
    }

    public void setTotalSessionsLast7Days(int totalSessionsLast7Days) {
        this.totalSessionsLast7Days = totalSessionsLast7Days;
    }

    public List<ChildSummaryDto> getChildren() {
        return children;
    }

    public void setChildren(List<ChildSummaryDto> children) {
        this.children = children;
    }

    public List<ProgressLogResponse> getRecentSessions() {
        return recentSessions;
    }

    public void setRecentSessions(List<ProgressLogResponse> recentSessions) {
        this.recentSessions = recentSessions;
    }
}
