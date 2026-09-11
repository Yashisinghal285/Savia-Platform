package com.saarthi.backend.dto;

import com.saarthi.backend.entity.User;

public class UserResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Boolean active;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.role = user.getRole();
        this.active = user.getActive();
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

    public Boolean getActive() {
        return active;
    }
}