package com.saarthi.backend.dto;

import com.saarthi.backend.entity.Child;

public class ChildResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String dateOfBirth;
    private String gender;
    private String disabilityType;
    private String additionalNeeds;
    private Boolean active;

    public ChildResponse(Child child) {
        this.id = child.getId();
        this.firstName = child.getFirstName();
        this.lastName = child.getLastName();
        this.dateOfBirth = child.getDateOfBirth().toString();
        this.gender = child.getGender();
        this.disabilityType = child.getDisabilityType();
        this.additionalNeeds = child.getAdditionalNeeds();
        this.active = child.getActive();
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getDisabilityType() {
        return disabilityType;
    }

    public String getAdditionalNeeds() {
        return additionalNeeds;
    }

    public Boolean getActive() {
        return active;
    }
}