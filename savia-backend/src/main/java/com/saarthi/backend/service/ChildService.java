package com.saarthi.backend.service;

import com.saarthi.backend.dto.ChildGuardianRequest;
import com.saarthi.backend.dto.ChildGuardianResponse;
import com.saarthi.backend.dto.ChildNeedsProfileRequest;
import com.saarthi.backend.dto.ChildNeedsProfileResponse;
import com.saarthi.backend.dto.ChildRequest;
import com.saarthi.backend.entity.Child;
import com.saarthi.backend.entity.ChildGuardian;
import com.saarthi.backend.entity.ChildNeedsProfile;
import com.saarthi.backend.entity.User;
import com.saarthi.backend.exception.BadRequestException;
import com.saarthi.backend.exception.ConflictException;
import com.saarthi.backend.exception.ForbiddenException;
import com.saarthi.backend.exception.ResourceNotFoundException;
import com.saarthi.backend.repository.ChildGuardianRepository;
import com.saarthi.backend.repository.ChildNeedsProfileRepository;
import com.saarthi.backend.repository.ChildRepository;
import com.saarthi.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChildService {

    private final ChildRepository childRepository;
    private final ChildGuardianRepository childGuardianRepository;
    private final ChildNeedsProfileRepository childNeedsProfileRepository;
    private final UserRepository userRepository;

    public ChildService(
            ChildRepository childRepository,
            ChildGuardianRepository childGuardianRepository,
            ChildNeedsProfileRepository childNeedsProfileRepository,
            UserRepository userRepository) {

        this.childRepository = childRepository;
        this.childGuardianRepository = childGuardianRepository;
        this.childNeedsProfileRepository = childNeedsProfileRepository;
        this.userRepository = userRepository;
    }

    public Child createChild(ChildRequest request, String creatorEmail) {

        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + creatorEmail));

        Child child = new Child();

        child.setFirstName(request.getFirstName());
        child.setLastName(request.getLastName());
        child.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        child.setGender(request.getGender());
        child.setDisabilityType(request.getDisabilityType());
        child.setAdditionalNeeds(request.getAdditionalNeeds());
        child.setActive(true);
        child.setCreatedAt(LocalDateTime.now());
        child.setUpdatedAt(LocalDateTime.now());

        Child savedChild = childRepository.save(child);

        ChildGuardian link = new ChildGuardian();
        link.setChildId(savedChild.getId());
        link.setUserId(creator.getId());
        link.setRelationshipType("GUARDIAN");
        link.setCreatedAt(LocalDateTime.now());

        childGuardianRepository.save(link);

        return savedChild;
    }

    public List<Child> getMyChildren(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        List<ChildGuardian> links = childGuardianRepository.findByUserId(user.getId());

        return links.stream()
                .map(link -> childRepository.findById(link.getChildId())
                        .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + link.getChildId())))
                .toList();
    }

    public Child getChildById(Long childId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(childId, user.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));
        }

        return childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));
    }

    public Child updateChild(Long childId, ChildRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isAdmin) {
            ChildGuardian link = childGuardianRepository.findByChildIdAndUserId(childId, user.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));

            if (!"GUARDIAN".equals(link.getRelationshipType())) {
                throw new ForbiddenException("Only a GUARDIAN can edit this child's profile");
            }
        }

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        child.setFirstName(request.getFirstName());
        child.setLastName(request.getLastName());
        child.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        child.setGender(request.getGender());
        child.setDisabilityType(request.getDisabilityType());
        child.setAdditionalNeeds(request.getAdditionalNeeds());
        child.setUpdatedAt(LocalDateTime.now());

        return childRepository.save(child);
    }

    public ChildGuardianResponse addGuardian(Long childId, ChildGuardianRequest request, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian requesterLink = childGuardianRepository
                    .findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));

            if (!"GUARDIAN".equals(requesterLink.getRelationshipType())) {
                throw new ForbiddenException("Only a GUARDIAN can add other caregivers");
            }
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        User newAdult = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + request.getEmail()));

        childGuardianRepository.findByChildIdAndUserId(childId, newAdult.getId())
                .ifPresent(existing -> {
                    throw new ConflictException("This user is already linked to this child");
                });

        ChildGuardian newLink = new ChildGuardian();
        newLink.setChildId(childId);
        newLink.setUserId(newAdult.getId());
        newLink.setRelationshipType(request.getRelationshipType());
        newLink.setCreatedAt(LocalDateTime.now());

        ChildGuardian savedLink = childGuardianRepository.save(newLink);

        return new ChildGuardianResponse(savedLink, newAdult);
    }

    public List<ChildGuardianResponse> getGuardiansForChild(Long childId, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        List<ChildGuardian> links = childGuardianRepository.findByChildId(childId);

        return links.stream()
                .map(link -> {
                    User user = userRepository.findById(link.getUserId()).orElse(null);
                    return new ChildGuardianResponse(link, user);
                })
                .toList();
    }

    public void removeGuardian(Long childId, Long targetUserId, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian requesterLink = childGuardianRepository
                    .findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));

            if (!"GUARDIAN".equals(requesterLink.getRelationshipType())) {
                throw new ForbiddenException("Only a GUARDIAN can remove caregivers");
            }
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        ChildGuardian targetLink = childGuardianRepository
                .findByChildIdAndUserId(childId, targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("This user is not linked to this child"));

        if ("GUARDIAN".equals(targetLink.getRelationshipType())) {
            long guardianCount = childGuardianRepository.findByChildId(childId).stream()
                    .filter(g -> "GUARDIAN".equals(g.getRelationshipType()))
                    .count();

            if (guardianCount <= 1) {
                throw new BadRequestException("Cannot remove the only GUARDIAN for this child");
            }
        }

        childGuardianRepository.delete(targetLink);
    }

    public ChildGuardianResponse updateGuardianRole(Long childId, Long targetUserId, String newRelationshipType, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian requesterLink = childGuardianRepository
                    .findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));

            if (!"GUARDIAN".equals(requesterLink.getRelationshipType())) {
                throw new ForbiddenException("Only a GUARDIAN can update caregiver roles");
            }
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        ChildGuardian targetLink = childGuardianRepository
                .findByChildIdAndUserId(childId, targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("This user is not linked to this child"));

        if ("GUARDIAN".equals(targetLink.getRelationshipType()) && !"GUARDIAN".equals(newRelationshipType)) {
            long guardianCount = childGuardianRepository.findByChildId(childId).stream()
                    .filter(g -> "GUARDIAN".equals(g.getRelationshipType()))
                    .count();

            if (guardianCount <= 1) {
                throw new BadRequestException("Cannot demote the only GUARDIAN for this child");
            }
        }

        targetLink.setRelationshipType(newRelationshipType);
        ChildGuardian savedLink = childGuardianRepository.save(targetLink);

        User targetUser = userRepository.findById(targetUserId).orElse(null);

        return new ChildGuardianResponse(savedLink, targetUser);
    }

    public ChildNeedsProfileResponse getNeedsProfile(Long childId, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        ChildNeedsProfile profile = childNeedsProfileRepository.findByChildId(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Needs profile not found for this child"));

        return new ChildNeedsProfileResponse(profile);
    }

    public ChildNeedsProfileResponse upsertNeedsProfile(Long childId, ChildNeedsProfileRequest request, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian requesterLink = childGuardianRepository
                    .findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));

            if (!"GUARDIAN".equals(requesterLink.getRelationshipType())) {
                throw new ForbiddenException("Only a GUARDIAN can edit this child's needs profile");
            }
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        ChildNeedsProfile profile = childNeedsProfileRepository.findByChildId(childId)
                .orElseGet(() -> {
                    ChildNeedsProfile newProfile = new ChildNeedsProfile();
                    newProfile.setChildId(childId);
                    newProfile.setCreatedAt(LocalDateTime.now());
                    return newProfile;
                });

        profile.setPrimaryDiagnosis(request.getPrimaryDiagnosis());
        profile.setSecondaryDiagnosis(request.getSecondaryDiagnosis());
        profile.setSeverityLevel(request.getSeverityLevel());
        profile.setCommunicationMode(request.getCommunicationMode());
        profile.setMobilityStatus(request.getMobilityStatus());
        profile.setDietaryRestrictions(request.getDietaryRestrictions());
        profile.setAllergies(request.getAllergies());
        profile.setBehavioralTriggers(request.getBehavioralTriggers());
        profile.setCalmingStrategies(request.getCalmingStrategies());
        profile.setEmergencyMedications(request.getEmergencyMedications());
        profile.setMedicalNotes(request.getMedicalNotes());
        profile.setUpdatedAt(LocalDateTime.now());

        ChildNeedsProfile savedProfile = childNeedsProfileRepository.save(profile);

        return new ChildNeedsProfileResponse(savedProfile);
    }
}