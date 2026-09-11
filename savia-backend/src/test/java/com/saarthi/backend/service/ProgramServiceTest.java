package com.saarthi.backend.service;

import com.saarthi.backend.dto.ProgramRequest;
import com.saarthi.backend.dto.ProgramResponse;
import com.saarthi.backend.entity.Child;
import com.saarthi.backend.entity.ChildGuardian;
import com.saarthi.backend.entity.Program;
import com.saarthi.backend.entity.User;
import com.saarthi.backend.exception.ForbiddenException;
import com.saarthi.backend.repository.ChildGuardianRepository;
import com.saarthi.backend.repository.ChildRepository;
import com.saarthi.backend.repository.ProgramRepository;
import com.saarthi.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProgramServiceTest {

    @Mock
    private ProgramRepository programRepository;

    @Mock
    private ChildRepository childRepository;

    @Mock
    private ChildGuardianRepository childGuardianRepository;

    @Mock
    private UserRepository userRepository;

    private ProgramService programService;

    @BeforeEach
    void setUp() {
        programService = new ProgramService(
                programRepository,
                childRepository,
                childGuardianRepository,
                userRepository
        );
    }

    @Test
    void testCreateProgramByTherapistSuccess() {
        ProgramRequest request = new ProgramRequest();
        request.setTitle("AAC Speech Articulation");
        request.setCategory("SPEECH_THERAPY");
        request.setFrequency("DAILY");
        request.setTargetGoal("Speak 5 core phrases");

        User therapist = new User();
        therapist.setId(3L);
        therapist.setEmail("therapist@example.com");

        ChildGuardian link = new ChildGuardian();
        link.setRelationshipType("THERAPIST");

        Child child = new Child();
        child.setId(10L);

        when(userRepository.findByEmail("therapist@example.com")).thenReturn(Optional.of(therapist));
        when(childGuardianRepository.findByChildIdAndUserId(10L, 3L)).thenReturn(Optional.of(link));
        when(childRepository.findById(10L)).thenReturn(Optional.of(child));
        when(programRepository.save(any(Program.class))).thenAnswer(invocation -> {
            Program p = invocation.getArgument(0);
            p.setId(100L);
            return p;
        });

        ProgramResponse response = programService.createProgram(10L, request, "therapist@example.com");

        assertNotNull(response);
        assertEquals("AAC Speech Articulation", response.getTitle());
        assertEquals("SPEECH_THERAPY", response.getCategory());
        assertEquals("ACTIVE", response.getStatus());
        verify(programRepository, times(1)).save(any(Program.class));
    }

    @Test
    void testCreateProgramByCaregiverThrowsForbidden() {
        ProgramRequest request = new ProgramRequest();
        request.setTitle("Physical Exercise");

        User caregiver = new User();
        caregiver.setId(2L);
        caregiver.setEmail("caregiver@example.com");

        ChildGuardian link = new ChildGuardian();
        link.setRelationshipType("CAREGIVER");

        when(userRepository.findByEmail("caregiver@example.com")).thenReturn(Optional.of(caregiver));
        when(childGuardianRepository.findByChildIdAndUserId(10L, 2L)).thenReturn(Optional.of(link));

        assertThrows(ForbiddenException.class, () -> programService.createProgram(10L, request, "caregiver@example.com"));
        verify(programRepository, never()).save(any(Program.class));
    }
}
