package com.saarthi.backend.service;

import com.saarthi.backend.dto.ProgressLogRequest;
import com.saarthi.backend.dto.ProgressLogResponse;
import com.saarthi.backend.entity.Child;
import com.saarthi.backend.entity.ChildGuardian;
import com.saarthi.backend.entity.ProgressLog;
import com.saarthi.backend.entity.Program;
import com.saarthi.backend.entity.User;
import com.saarthi.backend.exception.BadRequestException;
import com.saarthi.backend.exception.ForbiddenException;
import com.saarthi.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProgressServiceTest {

    @Mock
    private ProgressLogRepository progressLogRepository;

    @Mock
    private ChildRepository childRepository;

    @Mock
    private ProgramRepository programRepository;

    @Mock
    private ChildGuardianRepository childGuardianRepository;

    @Mock
    private UserRepository userRepository;

    private ProgressService progressService;

    @BeforeEach
    void setUp() {
        progressService = new ProgressService(
                progressLogRepository,
                childRepository,
                programRepository,
                childGuardianRepository,
                userRepository
        );
    }

    @Test
    void testLogProgressSuccess() {
        ProgressLogRequest request = new ProgressLogRequest();
        request.setSessionDate("2026-08-30");
        request.setDurationMinutes(45);
        request.setMoodRating("HAPPY");
        request.setPerformanceRating("GOOD");
        request.setMilestoneAchieved("Completed 5 tasks");

        User caregiver = new User();
        caregiver.setId(2L);
        caregiver.setEmail("caregiver@example.com");

        ChildGuardian link = new ChildGuardian();
        link.setRelationshipType("CAREGIVER");

        Child child = new Child();
        child.setId(10L);

        when(userRepository.findByEmail("caregiver@example.com")).thenReturn(Optional.of(caregiver));
        when(childGuardianRepository.findByChildIdAndUserId(10L, 2L)).thenReturn(Optional.of(link));
        when(childRepository.findById(10L)).thenReturn(Optional.of(child));
        when(progressLogRepository.save(any(ProgressLog.class))).thenAnswer(invocation -> {
            ProgressLog log = invocation.getArgument(0);
            log.setId(500L);
            return log;
        });

        ProgressLogResponse response = progressService.logProgress(10L, request, "caregiver@example.com");

        assertNotNull(response);
        assertEquals(45, response.getDurationMinutes());
        assertEquals("HAPPY", response.getMoodRating());
        assertEquals("GOOD", response.getPerformanceRating());
        verify(progressLogRepository, times(1)).save(any(ProgressLog.class));
    }

    @Test
    void testLogProgressProgramBelongsToDifferentChildThrowsBadRequest() {
        ProgressLogRequest request = new ProgressLogRequest();
        request.setProgramId(99L);
        request.setSessionDate("2026-08-30");
        request.setDurationMinutes(30);

        User caregiver = new User();
        caregiver.setId(2L);
        caregiver.setEmail("caregiver@example.com");

        ChildGuardian link = new ChildGuardian();
        link.setRelationshipType("CAREGIVER");

        Child child = new Child();
        child.setId(10L);

        Program otherChildProgram = new Program();
        otherChildProgram.setId(99L);
        otherChildProgram.setChildId(888L); // Different child!

        when(userRepository.findByEmail("caregiver@example.com")).thenReturn(Optional.of(caregiver));
        when(childGuardianRepository.findByChildIdAndUserId(10L, 2L)).thenReturn(Optional.of(link));
        when(childRepository.findById(10L)).thenReturn(Optional.of(child));
        when(programRepository.findById(99L)).thenReturn(Optional.of(otherChildProgram));

        assertThrows(BadRequestException.class, () -> progressService.logProgress(10L, request, "caregiver@example.com"));
    }
}
