package com.saarthi.backend.service;

import com.saarthi.backend.dto.ChildGuardianRequest;
import com.saarthi.backend.dto.ChildGuardianResponse;
import com.saarthi.backend.dto.ChildRequest;
import com.saarthi.backend.entity.Child;
import com.saarthi.backend.entity.ChildGuardian;
import com.saarthi.backend.entity.User;
import com.saarthi.backend.exception.ConflictException;
import com.saarthi.backend.exception.ForbiddenException;
import com.saarthi.backend.exception.ResourceNotFoundException;
import com.saarthi.backend.repository.ChildGuardianRepository;
import com.saarthi.backend.repository.ChildNeedsProfileRepository;
import com.saarthi.backend.repository.ChildRepository;
import com.saarthi.backend.repository.UserRepository;
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
class ChildServiceTest {

    @Mock
    private ChildRepository childRepository;

    @Mock
    private ChildGuardianRepository childGuardianRepository;

    @Mock
    private ChildNeedsProfileRepository childNeedsProfileRepository;

    @Mock
    private UserRepository userRepository;

    private ChildService childService;

    @BeforeEach
    void setUp() {
        childService = new ChildService(
                childRepository,
                childGuardianRepository,
                childNeedsProfileRepository,
                userRepository
        );
    }

    @Test
    void testCreateChildSuccess() {
        ChildRequest request = new ChildRequest();
        request.setFirstName("Reyansh");
        request.setLastName("Sharma");
        request.setDateOfBirth("2017-06-10");
        request.setGender("MALE");
        request.setDisabilityType("Autism");

        User creator = new User();
        creator.setId(1L);
        creator.setEmail("ananya@example.com");

        when(userRepository.findByEmail("ananya@example.com")).thenReturn(Optional.of(creator));
        when(childRepository.save(any(Child.class))).thenAnswer(invocation -> {
            Child c = invocation.getArgument(0);
            c.setId(10L);
            return c;
        });

        Child result = childService.createChild(request, "ananya@example.com");

        assertNotNull(result);
        assertEquals("Reyansh", result.getFirstName());
        assertEquals(10L, result.getId());
        verify(childGuardianRepository, times(1)).save(any(ChildGuardian.class));
    }

    @Test
    void testGetChildByIdUnauthorizedUserThrowsForbidden() {
        User stranger = new User();
        stranger.setId(99L);
        stranger.setEmail("stranger@example.com");
        stranger.setRole("GUARDIAN");

        when(userRepository.findByEmail("stranger@example.com")).thenReturn(Optional.of(stranger));
        when(childGuardianRepository.findByChildIdAndUserId(10L, 99L)).thenReturn(Optional.empty());

        assertThrows(ForbiddenException.class, () -> childService.getChildById(10L, "stranger@example.com"));
    }

    @Test
    void testAddGuardianDuplicateLinkThrowsConflict() {
        User requester = new User();
        requester.setId(1L);
        requester.setEmail("guardian@example.com");

        ChildGuardian link = new ChildGuardian();
        link.setRelationshipType("GUARDIAN");

        Child child = new Child();
        child.setId(10L);

        User caregiver = new User();
        caregiver.setId(2L);
        caregiver.setEmail("caregiver@example.com");

        ChildGuardianRequest request = new ChildGuardianRequest();
        request.setEmail("caregiver@example.com");
        request.setRelationshipType("CAREGIVER");

        when(userRepository.findByEmail("guardian@example.com")).thenReturn(Optional.of(requester));
        when(childGuardianRepository.findByChildIdAndUserId(10L, 1L)).thenReturn(Optional.of(link));
        when(childRepository.findById(10L)).thenReturn(Optional.of(child));
        when(userRepository.findByEmail("caregiver@example.com")).thenReturn(Optional.of(caregiver));
        when(childGuardianRepository.findByChildIdAndUserId(10L, 2L)).thenReturn(Optional.of(new ChildGuardian()));

        assertThrows(ConflictException.class, () -> childService.addGuardian(10L, request, "guardian@example.com"));
    }
}
