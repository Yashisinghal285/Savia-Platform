package com.saarthi.backend.controller;

import com.saarthi.backend.dto.ChildGuardianRequest;
import com.saarthi.backend.dto.ChildGuardianResponse;
import com.saarthi.backend.dto.ChildNeedsProfileRequest;
import com.saarthi.backend.dto.ChildNeedsProfileResponse;
import com.saarthi.backend.dto.ChildRequest;
import com.saarthi.backend.dto.ChildResponse;
import com.saarthi.backend.dto.UpdateGuardianRoleRequest;
import com.saarthi.backend.entity.Child;
import com.saarthi.backend.service.ChildService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Children & Beneficiaries", description = "Child profile, needs assessment, and care team collaboration management")
@RestController
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;

    public ChildController(ChildService childService) {
        this.childService = childService;
    }

    @Operation(summary = "Register a child profile", description = "Registers a new child and automatically links the creator as GUARDIAN.")
    @PostMapping
    public ResponseEntity<ChildResponse> createChild(
            @Valid @RequestBody ChildRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        Child child = childService.createChild(request, email);
        return ResponseEntity.ok(new ChildResponse(child));
    }

    @Operation(summary = "Get all accessible children", description = "Retrieves all children connected to the authenticated user's care network.")
    @GetMapping
    public ResponseEntity<List<ChildResponse>> getMyChildren(
            Authentication authentication) {

        String email = authentication.getName();
        List<ChildResponse> children = childService.getMyChildren(email)
                .stream()
                .map(ChildResponse::new)
                .toList();

        return ResponseEntity.ok(children);
    }

    @Operation(summary = "Get child profile by ID", description = "Retrieves demographic and disability information for a specific child.")
    @GetMapping("/{id}")
    public ResponseEntity<ChildResponse> getChildById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        Child child = childService.getChildById(id, email);
        return ResponseEntity.ok(new ChildResponse(child));
    }

    @Operation(summary = "Update child profile", description = "Updates child demographics (Restricted to GUARDIAN).")
    @PutMapping("/{id}")
    public ResponseEntity<ChildResponse> updateChild(
            @PathVariable Long id,
            @Valid @RequestBody ChildRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        Child updatedChild = childService.updateChild(id, request, email);
        return ResponseEntity.ok(new ChildResponse(updatedChild));
    }

    @Operation(summary = "Add a caregiver or therapist to child care team", description = "Links a registered user (by email) to the child's care team with a specific role.")
    @PostMapping("/{id}/guardians")
    public ResponseEntity<ChildGuardianResponse> addGuardian(
            @PathVariable Long id,
            @Valid @RequestBody ChildGuardianRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        ChildGuardianResponse response = childService.addGuardian(id, request, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "List all caregivers for a child", description = "Retrieves the care team linked to a child.")
    @GetMapping("/{id}/guardians")
    public ResponseEntity<List<ChildGuardianResponse>> getGuardiansForChild(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        List<ChildGuardianResponse> guardians = childService.getGuardiansForChild(id, email);
        return ResponseEntity.ok(guardians);
    }

    @Operation(summary = "Remove a caregiver from child care team", description = "Unlinks a caregiver/therapist from the child's care team (Restricted to GUARDIAN).")
    @DeleteMapping("/{id}/guardians/{userId}")
    public ResponseEntity<Void> removeGuardian(
            @PathVariable Long id,
            @PathVariable Long userId,
            Authentication authentication) {

        String email = authentication.getName();
        childService.removeGuardian(id, userId, email);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update caregiver relationship role", description = "Changes role between GUARDIAN, CAREGIVER, and THERAPIST.")
    @PutMapping("/{id}/guardians/{userId}")
    public ResponseEntity<ChildGuardianResponse> updateGuardianRole(
            @PathVariable Long id,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateGuardianRoleRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        ChildGuardianResponse response = childService.updateGuardianRole(id, userId, request.getRelationshipType(), email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get child needs and medical profile", description = "Retrieves communication modes, mobility, sensory triggers, calming strategies, and allergies.")
    @GetMapping("/{id}/needs")
    public ResponseEntity<ChildNeedsProfileResponse> getNeedsProfile(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        ChildNeedsProfileResponse response = childService.getNeedsProfile(id, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Create or update child needs profile", description = "Saves medical, sensory, dietary, and behavioral requirements for a child.")
    @PutMapping("/{id}/needs")
    public ResponseEntity<ChildNeedsProfileResponse> upsertNeedsProfile(
            @PathVariable Long id,
            @Valid @RequestBody ChildNeedsProfileRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        ChildNeedsProfileResponse response = childService.upsertNeedsProfile(id, request, email);
        return ResponseEntity.ok(response);
    }
}