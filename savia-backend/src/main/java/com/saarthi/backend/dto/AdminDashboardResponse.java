package com.saarthi.backend.dto;

import java.util.Map;

public class AdminDashboardResponse {

    private long totalUsers;
    private long totalActiveUsers;
    private long totalChildren;
    private long totalActiveChildren;
    private long totalPrograms;
    private long totalActivePrograms;
    private long totalProgressLogs;
    private long totalMinutesLogged;
    private Map<String, Long> roleBreakdown;
    private Map<String, Long> relationshipTypeBreakdown;

    public AdminDashboardResponse() {
    }

    // Getters and Setters

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalActiveUsers() {
        return totalActiveUsers;
    }

    public void setTotalActiveUsers(long totalActiveUsers) {
        this.totalActiveUsers = totalActiveUsers;
    }

    public long getTotalChildren() {
        return totalChildren;
    }

    public void setTotalChildren(long totalChildren) {
        this.totalChildren = totalChildren;
    }

    public long getTotalActiveChildren() {
        return totalActiveChildren;
    }

    public void setTotalActiveChildren(long totalActiveChildren) {
        this.totalActiveChildren = totalActiveChildren;
    }

    public long getTotalPrograms() {
        return totalPrograms;
    }

    public void setTotalPrograms(long totalPrograms) {
        this.totalPrograms = totalPrograms;
    }

    public long getTotalActivePrograms() {
        return totalActivePrograms;
    }

    public void setTotalActivePrograms(long totalActivePrograms) {
        this.totalActivePrograms = totalActivePrograms;
    }

    public long getTotalProgressLogs() {
        return totalProgressLogs;
    }

    public void setTotalProgressLogs(long totalProgressLogs) {
        this.totalProgressLogs = totalProgressLogs;
    }

    public long getTotalMinutesLogged() {
        return totalMinutesLogged;
    }

    public void setTotalMinutesLogged(long totalMinutesLogged) {
        this.totalMinutesLogged = totalMinutesLogged;
    }

    public Map<String, Long> getRoleBreakdown() {
        return roleBreakdown;
    }

    public void setRoleBreakdown(Map<String, Long> roleBreakdown) {
        this.roleBreakdown = roleBreakdown;
    }

    public Map<String, Long> getRelationshipTypeBreakdown() {
        return relationshipTypeBreakdown;
    }

    public void setRelationshipTypeBreakdown(Map<String, Long> relationshipTypeBreakdown) {
        this.relationshipTypeBreakdown = relationshipTypeBreakdown;
    }
}
