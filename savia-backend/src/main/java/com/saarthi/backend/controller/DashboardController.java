package com.saarthi.backend.controller;

import com.saarthi.backend.dto.AdminDashboardResponse;
import com.saarthi.backend.dto.ChildDashboardResponse;
import com.saarthi.backend.dto.UserDashboardResponse;
import com.saarthi.backend.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboards & Analytics", description = "Aggregated intelligence for caregivers, guardians, and platform administrators")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @Operation(summary = "Get user personal overview dashboard", description = "Aggregates care roles, total linked children, active programs, and recent session logs.")
    @GetMapping("/me")
    public ResponseEntity<UserDashboardResponse> getUserDashboard(Authentication authentication) {

        String email = authentication.getName();
        UserDashboardResponse response = dashboardService.getUserDashboard(email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get Child 360° holistic dashboard", description = "Aggregates child needs profile, care team network, active therapy programs, session logs, and mood/performance distributions.")
    @GetMapping("/children/{childId}")
    public ResponseEntity<ChildDashboardResponse> getChildDashboard(
            @PathVariable Long childId,
            Authentication authentication) {

        String email = authentication.getName();
        ChildDashboardResponse response = dashboardService.getChildDashboard(childId, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get platform-wide admin analytics", description = "Platform KPIs across all users, children, active programs, and total session minutes (Restricted to ADMIN).")
    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard(Authentication authentication) {

        String email = authentication.getName();
        AdminDashboardResponse response = dashboardService.getAdminDashboard(email);
        return ResponseEntity.ok(response);
    }
}
