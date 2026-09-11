package com.saarthi.backend.service;

import com.saarthi.backend.dto.LoginRequest;
import com.saarthi.backend.dto.LoginResponse;
import com.saarthi.backend.dto.RegisterRequest;
import com.saarthi.backend.entity.User;
import com.saarthi.backend.exception.ConflictException;
import com.saarthi.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("ananya@example.com");
        request.setPassword("Password123!");
        request.setFirstName("Ananya");
        request.setLastName("Sharma");

        when(userRepository.existsByEmail("ananya@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        User result = authService.register(request);

        assertNotNull(result);
        assertEquals("ananya@example.com", result.getEmail());
        assertEquals("Ananya", result.getFirstName());
        assertEquals("USER", result.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsConflict() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setPassword("Password123!");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ananya@example.com");
        request.setPassword("Password123!");

        User user = new User();
        user.setId(1L);
        user.setEmail("ananya@example.com");
        user.setPasswordHash("hashedPassword");
        user.setRole("USER");
        user.setFirstName("Ananya");
        user.setActive(true);

        when(userRepository.findByEmail("ananya@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123!", "hashedPassword")).thenReturn(true);
        when(jwtService.generateToken(user.getEmail(), user.getRole())).thenReturn("mock.jwt.token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("ananya@example.com", response.getEmail());
        assertEquals("USER", response.getRole());
    }

    @Test
    void testLoginInvalidPasswordThrowsBadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ananya@example.com");
        request.setPassword("WrongPassword");

        User user = new User();
        user.setEmail("ananya@example.com");
        user.setPasswordHash("hashedPassword");
        user.setActive(true);

        when(userRepository.findByEmail("ananya@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword", "hashedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
