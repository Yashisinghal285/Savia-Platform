package com.saarthi.backend.service;

import com.saarthi.backend.dto.ProgramRequest;
import com.saarthi.backend.dto.ProgramResponse;
import com.saarthi.backend.entity.ChildGuardian;
import com.saarthi.backend.entity.Program;
import com.saarthi.backend.entity.User;
import com.saarthi.backend.exception.ForbiddenException;
import com.saarthi.backend.exception.ResourceNotFoundException;
import com.saarthi.backend.repository.ChildGuardianRepository;
import com.saarthi.backend.repository.ChildRepository;
import com.saarthi.backend.repository.ProgramRepository;
import com.saarthi.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final ChildRepository childRepository;
    private final ChildGuardianRepository childGuardianRepository;
    private final UserRepository userRepository;

    public ProgramService(
            ProgramRepository programRepository,
            ChildRepository childRepository,
            ChildGuardianRepository childGuardianRepository,
            UserRepository userRepository) {

        this.programRepository = programRepository;
        this.childRepository = childRepository;
        this.childGuardianRepository = childGuardianRepository;
        this.userRepository = userRepository;
    }

    public ProgramResponse createProgram(Long childId, ProgramRequest request, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian requesterLink = childGuardianRepository
                    .findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));

            boolean isGuardianOrTherapist = "GUARDIAN".equals(requesterLink.getRelationshipType())
                    || "THERAPIST".equals(requesterLink.getRelationshipType());

            if (!isGuardianOrTherapist) {
                throw new ForbiddenException("Only a GUARDIAN or THERAPIST can create programs for this child");
            }
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        Program program = new Program();
        program.setChildId(childId);
        program.setCreatedByUserId(requester.getId());
        program.setTitle(request.getTitle());
        program.setDescription(request.getDescription());
        program.setCategory(request.getCategory());
        program.setFrequency(request.getFrequency() != null ? request.getFrequency() : "DAILY");
        program.setTargetGoal(request.getTargetGoal());
        program.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        if (request.getStartDate() != null && !request.getStartDate().isBlank()) {
            program.setStartDate(LocalDate.parse(request.getStartDate()));
        }
        if (request.getEndDate() != null && !request.getEndDate().isBlank()) {
            program.setEndDate(LocalDate.parse(request.getEndDate()));
        }

        program.setCreatedAt(LocalDateTime.now());
        program.setUpdatedAt(LocalDateTime.now());

        Program savedProgram = programRepository.save(program);

        return new ProgramResponse(savedProgram, requester);
    }

    public List<ProgramResponse> getProgramsForChild(Long childId, String status, String category, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        List<Program> programs;
        if (status != null && !status.isBlank()) {
            programs = programRepository.findByChildIdAndStatus(childId, status);
        } else if (category != null && !category.isBlank()) {
            programs = programRepository.findByChildIdAndCategory(childId, category);
        } else {
            programs = programRepository.findByChildId(childId);
        }

        return programs.stream()
                .map(p -> {
                    User creator = userRepository.findById(p.getCreatedByUserId()).orElse(null);
                    return new ProgramResponse(p, creator);
                })
                .toList();
    }

    public ProgramResponse getProgramById(Long programId, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new ResourceNotFoundException("Program not found with ID " + programId));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(program.getChildId(), requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child's program"));
        }

        User creator = userRepository.findById(program.getCreatedByUserId()).orElse(null);

        return new ProgramResponse(program, creator);
    }

    public ProgramResponse updateProgram(Long programId, ProgramRequest request, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new ResourceNotFoundException("Program not found with ID " + programId));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian requesterLink = childGuardianRepository
                    .findByChildIdAndUserId(program.getChildId(), requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child's program"));

            boolean isCreator = program.getCreatedByUserId().equals(requester.getId());
            boolean isGuardian = "GUARDIAN".equals(requesterLink.getRelationshipType());

            if (!isCreator && !isGuardian) {
                throw new ForbiddenException("Only the creator or a GUARDIAN can update this program");
            }
        }

        if (request.getTitle() != null) program.setTitle(request.getTitle());
        if (request.getDescription() != null) program.setDescription(request.getDescription());
        if (request.getCategory() != null) program.setCategory(request.getCategory());
        if (request.getFrequency() != null) program.setFrequency(request.getFrequency());
        if (request.getTargetGoal() != null) program.setTargetGoal(request.getTargetGoal());
        if (request.getStatus() != null) program.setStatus(request.getStatus());

        if (request.getStartDate() != null) {
            program.setStartDate(request.getStartDate().isBlank() ? null : LocalDate.parse(request.getStartDate()));
        }
        if (request.getEndDate() != null) {
            program.setEndDate(request.getEndDate().isBlank() ? null : LocalDate.parse(request.getEndDate()));
        }

        program.setUpdatedAt(LocalDateTime.now());

        Program savedProgram = programRepository.save(program);
        User creator = userRepository.findById(savedProgram.getCreatedByUserId()).orElse(null);

        return new ProgramResponse(savedProgram, creator);
    }

    public void deleteProgram(Long programId, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new ResourceNotFoundException("Program not found with ID " + programId));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian requesterLink = childGuardianRepository
                    .findByChildIdAndUserId(program.getChildId(), requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child's program"));

            boolean isCreator = program.getCreatedByUserId().equals(requester.getId());
            boolean isGuardian = "GUARDIAN".equals(requesterLink.getRelationshipType());

            if (!isCreator && !isGuardian) {
                throw new ForbiddenException("Only the creator or a GUARDIAN can delete this program");
            }
        }

        programRepository.delete(program);
    }
}
