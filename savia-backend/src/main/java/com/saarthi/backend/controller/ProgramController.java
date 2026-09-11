package com.saarthi.backend.controller;

import com.saarthi.backend.dto.ProgramRequest;
import com.saarthi.backend.dto.ProgramResponse;
import com.saarthi.backend.service.ProgramService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Therapy Programs & Activities", description = "Prescribe, customize, and monitor therapy activities and routines")
@RestController
public class ProgramController {

    private final ProgramService programService;

    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }

    @Operation(summary = "Prescribe or create a therapy program", description = "Creates a new routine (Speech, Occupational, Physical, Behavioral, etc.) for a child.")
    @PostMapping("/api/children/{childId}/programs")
    public ResponseEntity<ProgramResponse> createProgram(
            @PathVariable Long childId,
            @Valid @RequestBody ProgramRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        ProgramResponse response = programService.createProgram(childId, request, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all therapy programs for a child", description = "Retrieves all programs for a child, filterable by status (ACTIVE, COMPLETED) or category.")
    @GetMapping("/api/children/{childId}/programs")
    public ResponseEntity<List<ProgramResponse>> getProgramsForChild(
            @PathVariable Long childId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            Authentication authentication) {

        String email = authentication.getName();
        List<ProgramResponse> programs = programService.getProgramsForChild(childId, status, category, email);
        return ResponseEntity.ok(programs);
    }

    @Operation(summary = "Get therapy program details by ID", description = "Retrieves specific program target goals and frequency.")
    @GetMapping("/api/programs/{id}")
    public ResponseEntity<ProgramResponse> getProgramById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        ProgramResponse response = programService.getProgramById(id, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update therapy program", description = "Modifies targets, schedule, status, or description.")
    @PutMapping("/api/programs/{id}")
    public ResponseEntity<ProgramResponse> updateProgram(
            @PathVariable Long id,
            @Valid @RequestBody ProgramRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        ProgramResponse response = programService.updateProgram(id, request, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete therapy program", description = "Deletes a therapy program (Restricted to author or GUARDIAN).")
    @DeleteMapping("/api/programs/{id}")
    public ResponseEntity<Void> deleteProgram(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        programService.deleteProgram(id, email);
        return ResponseEntity.noContent().build();
    }
}
