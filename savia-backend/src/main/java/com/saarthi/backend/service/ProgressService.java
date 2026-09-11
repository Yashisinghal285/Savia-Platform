package com.saarthi.backend.service;

import com.saarthi.backend.dto.ProgressLogRequest;
import com.saarthi.backend.dto.ProgressLogResponse;
import com.saarthi.backend.entity.ChildGuardian;
import com.saarthi.backend.entity.ProgressLog;
import com.saarthi.backend.entity.Program;
import com.saarthi.backend.entity.User;
import com.saarthi.backend.exception.BadRequestException;
import com.saarthi.backend.exception.ForbiddenException;
import com.saarthi.backend.exception.ResourceNotFoundException;
import com.saarthi.backend.repository.ChildGuardianRepository;
import com.saarthi.backend.repository.ChildRepository;
import com.saarthi.backend.repository.ProgressLogRepository;
import com.saarthi.backend.repository.ProgramRepository;
import com.saarthi.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProgressService {

    private final ProgressLogRepository progressLogRepository;
    private final ChildRepository childRepository;
    private final ProgramRepository programRepository;
    private final ChildGuardianRepository childGuardianRepository;
    private final UserRepository userRepository;

    public ProgressService(
            ProgressLogRepository progressLogRepository,
            ChildRepository childRepository,
            ProgramRepository programRepository,
            ChildGuardianRepository childGuardianRepository,
            UserRepository userRepository) {

        this.progressLogRepository = progressLogRepository;
        this.childRepository = childRepository;
        this.programRepository = programRepository;
        this.childGuardianRepository = childGuardianRepository;
        this.userRepository = userRepository;
    }

    public ProgressLogResponse logProgress(Long childId, ProgressLogRequest request, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        Program program = null;
        if (request.getProgramId() != null) {
            program = programRepository.findById(request.getProgramId())
                    .orElseThrow(() -> new ResourceNotFoundException("Program not found with ID " + request.getProgramId()));

            if (!program.getChildId().equals(childId)) {
                throw new BadRequestException("Program does not belong to this child");
            }
        }

        ProgressLog log = new ProgressLog();
        log.setChildId(childId);
        log.setProgramId(request.getProgramId());
        log.setLoggedByUserId(requester.getId());
        log.setSessionDate(LocalDate.parse(request.getSessionDate()));
        log.setDurationMinutes(request.getDurationMinutes());
        log.setMoodRating(request.getMoodRating());
        log.setPerformanceRating(request.getPerformanceRating());
        log.setMilestoneAchieved(request.getMilestoneAchieved());
        log.setNotes(request.getNotes());
        log.setChallengesFaced(request.getChallengesFaced());
        log.setCreatedAt(LocalDateTime.now());
        log.setUpdatedAt(LocalDateTime.now());

        ProgressLog savedLog = progressLogRepository.save(log);

        return new ProgressLogResponse(savedLog, requester, program);
    }

    public List<ProgressLogResponse> getProgressLogsForChild(Long childId, Long programId, String startDate, String endDate, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(childId, requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));
        }

        childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        List<ProgressLog> logs;
        if (programId != null) {
            logs = progressLogRepository.findByChildIdAndProgramId(childId, programId);
        } else if (startDate != null && !startDate.isBlank() && endDate != null && !endDate.isBlank()) {
            logs = progressLogRepository.findByChildIdAndSessionDateBetween(childId, LocalDate.parse(startDate), LocalDate.parse(endDate));
        } else {
            logs = progressLogRepository.findByChildId(childId);
        }

        return logs.stream()
                .map(l -> {
                    User logger = userRepository.findById(l.getLoggedByUserId()).orElse(null);
                    Program prog = l.getProgramId() != null ? programRepository.findById(l.getProgramId()).orElse(null) : null;
                    return new ProgressLogResponse(l, logger, prog);
                })
                .toList();
    }

    public List<ProgressLogResponse> getProgressLogsForProgram(Long programId, String requesterEmail) {

        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new ResourceNotFoundException("Program not found with ID " + programId));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(program.getChildId(), requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child's progress"));
        }

        List<ProgressLog> logs = progressLogRepository.findByProgramId(programId);

        return logs.stream()
                .map(l -> {
                    User logger = userRepository.findById(l.getLoggedByUserId()).orElse(null);
                    return new ProgressLogResponse(l, logger, program);
                })
                .toList();
    }

    public ProgressLogResponse getProgressLogById(Long logId, String requesterEmail) {

        ProgressLog log = progressLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress log not found with ID " + logId));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(log.getChildId(), requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this progress log"));
        }

        User logger = userRepository.findById(log.getLoggedByUserId()).orElse(null);
        Program prog = log.getProgramId() != null ? programRepository.findById(log.getProgramId()).orElse(null) : null;

        return new ProgressLogResponse(log, logger, prog);
    }

    public ProgressLogResponse updateProgressLog(Long logId, ProgressLogRequest request, String requesterEmail) {

        ProgressLog log = progressLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress log not found with ID " + logId));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian link = childGuardianRepository.findByChildIdAndUserId(log.getChildId(), requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child's progress"));

            boolean isAuthor = log.getLoggedByUserId().equals(requester.getId());
            boolean isGuardian = "GUARDIAN".equals(link.getRelationshipType());

            if (!isAuthor && !isGuardian) {
                throw new ForbiddenException("Only the author or a GUARDIAN can update this progress log");
            }
        }

        if (request.getSessionDate() != null && !request.getSessionDate().isBlank()) {
            log.setSessionDate(LocalDate.parse(request.getSessionDate()));
        }
        if (request.getDurationMinutes() != null) {
            log.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getMoodRating() != null) {
            log.setMoodRating(request.getMoodRating());
        }
        if (request.getPerformanceRating() != null) {
            log.setPerformanceRating(request.getPerformanceRating());
        }
        if (request.getMilestoneAchieved() != null) {
            log.setMilestoneAchieved(request.getMilestoneAchieved());
        }
        if (request.getNotes() != null) {
            log.setNotes(request.getNotes());
        }
        if (request.getChallengesFaced() != null) {
            log.setChallengesFaced(request.getChallengesFaced());
        }

        log.setUpdatedAt(LocalDateTime.now());

        ProgressLog savedLog = progressLogRepository.save(log);

        User logger = userRepository.findById(savedLog.getLoggedByUserId()).orElse(null);
        Program prog = savedLog.getProgramId() != null ? programRepository.findById(savedLog.getProgramId()).orElse(null) : null;

        return new ProgressLogResponse(savedLog, logger, prog);
    }

    public void deleteProgressLog(Long logId, String requesterEmail) {

        ProgressLog log = progressLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress log not found with ID " + logId));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        boolean isAdmin = "ADMIN".equals(requester.getRole());

        if (!isAdmin) {
            ChildGuardian link = childGuardianRepository.findByChildIdAndUserId(log.getChildId(), requester.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child's progress"));

            boolean isAuthor = log.getLoggedByUserId().equals(requester.getId());
            boolean isGuardian = "GUARDIAN".equals(link.getRelationshipType());

            if (!isAuthor && !isGuardian) {
                throw new ForbiddenException("Only the author or a GUARDIAN can delete this progress log");
            }
        }

        progressLogRepository.delete(log);
    }
}
