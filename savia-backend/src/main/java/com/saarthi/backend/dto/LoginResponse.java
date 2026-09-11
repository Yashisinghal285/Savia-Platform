package com.saarthi.backend.dto;

public class LoginResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String token;

    public LoginResponse(
            Long id,
            String email,
            String firstName,
            String lastName,
            String role,
            String token) {

        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}