package com.saarthi.backend.controller;

import com.saarthi.backend.dto.ProgressLogRequest;
import com.saarthi.backend.dto.ProgressLogResponse;
import com.saarthi.backend.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Progress Tracking & Session Logs", description = "Record daily therapy sessions, mood, milestones, and challenges")
@RestController
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @Operation(summary = "Log therapy or activity session", description = "Records a daily session with duration, mood rating (HAPPY, CALM, FOCUSED, OVERWHELMED, etc.), performance rating, and milestone achievements.")
    @PostMapping("/api/children/{childId}/progress")
    public ResponseEntity<ProgressLogResponse> logProgress(
            @PathVariable Long childId,
            @Valid @RequestBody ProgressLogRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        ProgressLogResponse response = progressService.logProgress(childId, request, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get progress logs for a child", description = "Retrieves session logs for a child, filterable by programId or date range.")
    @GetMapping("/api/children/{childId}/progress")
    public ResponseEntity<List<ProgressLogResponse>> getProgressLogsForChild(
            @PathVariable Long childId,
            @RequestParam(required = false) Long programId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Authentication authentication) {

        String email = authentication.getName();
        List<ProgressLogResponse> logs = progressService.getProgressLogsForChild(childId, programId, startDate, endDate, email);
        return ResponseEntity.ok(logs);
    }

    @Operation(summary = "Get progress logs for a specific program", description = "Retrieves all sessions logged under a specific therapy program.")
    @GetMapping("/api/programs/{programId}/progress")
    public ResponseEntity<List<ProgressLogResponse>> getProgressLogsForProgram(
            @PathVariable Long programId,
            Authentication authentication) {

        String email = authentication.getName();
        List<ProgressLogResponse> logs = progressService.getProgressLogsForProgram(programId, email);
        return ResponseEntity.ok(logs);
    }

    @Operation(summary = "Get progress log by ID", description = "Retrieves a single progress log entry.")
    @GetMapping("/api/progress/{id}")
    public ResponseEntity<ProgressLogResponse> getProgressLogById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        ProgressLogResponse response = progressService.getProgressLogById(id, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update progress log", description = "Modifies a session log (Restricted to author or GUARDIAN).")
    @PutMapping("/api/progress/{id}")
    public ResponseEntity<ProgressLogResponse> updateProgressLog(
            @PathVariable Long id,
            @Valid @RequestBody ProgressLogRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        ProgressLogResponse response = progressService.updateProgressLog(id, request, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete progress log", description = "Removes a progress log (Restricted to author or GUARDIAN).")
    @DeleteMapping("/api/progress/{id}")
    public ResponseEntity<Void> deleteProgressLog(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        progressService.deleteProgressLog(id, email);
        return ResponseEntity.noContent().build();
    }
}
